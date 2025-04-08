import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

interface StateMetric {
  value: number;
  year: number;
  source: string;
  confidenceInterval: string;
  isRealData: boolean;
  category: string;
}

interface StateData {
  name: string;
  stateCode: string;
  region: string;
  population: number;
  happiness: StateMetric;
  healthcare: StateMetric;
  education: StateMetric;
  work_life: StateMetric;
  social_support: StateMetric;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Get state codes from query parameters if provided
    const stateCodes = event.queryStringParameters?.states?.split(',') || [];

    let states: StateData[] = [];

    if (stateCodes.length > 0) {
      // Fetch specific states
      for (const stateCode of stateCodes) {
        const command = new GetCommand({
          TableName: process.env.STATES_TABLE_NAME,
          Key: { stateCode }
        });
        const result = await docClient.send(command);
        if (result.Item) {
          states.push(result.Item as StateData);
        }
      }
    } else {
      // Fetch all states
      const command = new ScanCommand({
        TableName: process.env.STATES_TABLE_NAME
      });
      const result = await docClient.send(command);
      states = result.Items as StateData[];
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(states)
    };
  } catch (error) {
    console.error('Error fetching state data:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to fetch state data' })
    };
  }
}; 