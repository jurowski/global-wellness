import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

interface HappinessData {
  country: string;
  score: number;
  year: number;
  rank: number;
  gdpPerCapita: number;
  socialSupport: number;
  healthyLifeExpectancy: number;
  freedomToMakeChoices: number;
  generosity: number;
  perceptionsOfCorruption: number;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const countries = event.queryStringParameters?.countries?.split(',') || [];
    const year = parseInt(event.queryStringParameters?.year || '2023');

    let data: HappinessData[] = [];

    if (countries.length > 0) {
      // Query for specific countries
      const countryPromises = countries.map(async (country) => {
        const command = new QueryCommand({
          TableName: process.env.TABLE_NAME,
          KeyConditionExpression: 'countryYear = :countryYear AND country = :country',
          ExpressionAttributeValues: {
            ':countryYear': `${year}`,
            ':country': country,
          },
        });

        const response = await docClient.send(command);
        return response.Items?.[0] as HappinessData | undefined;
      });

      const results = await Promise.all(countryPromises);
      data = results.filter((item): item is HappinessData => item !== undefined);
    } else {
      // Query by year using the GSI
      const command = new QueryCommand({
        TableName: process.env.TABLE_NAME,
        IndexName: process.env.TABLE_YEAR_INDEX,
        KeyConditionExpression: '#year = :year',
        ExpressionAttributeNames: {
          '#year': 'year',
        },
        ExpressionAttributeValues: {
          ':year': year,
        },
      });

      const response = await docClient.send(command);
      data = (response.Items || []) as HappinessData[];
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching World Happiness Report data:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Error fetching World Happiness Report data',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}; 