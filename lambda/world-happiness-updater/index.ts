import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import axios from 'axios';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

interface RawHappinessData {
  Country: string;
  'Happiness Score': number;
  'GDP per capita': number;
  'Social support': number;
  'Healthy life expectancy': number;
  'Freedom to make life choices': number;
  Generosity: number;
  'Perceptions of corruption': number;
  Year: number;
  Rank: number;
}

interface HappinessData {
  countryYear: string;
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

export const handler = async (): Promise<void> => {
  try {
    // Download the latest data from Kaggle or World Happiness Report website
    // For now, we'll use sample data for 2023
    const sampleData: RawHappinessData[] = [
      {
        Country: 'Finland',
        'Happiness Score': 7.804,
        'GDP per capita': 1.888,
        'Social support': 1.585,
        'Healthy life expectancy': 0.535,
        'Freedom to make life choices': 0.772,
        Generosity: 0.126,
        'Perceptions of corruption': 0.535,
        Year: 2023,
        Rank: 1
      },
      {
        Country: 'Denmark',
        'Happiness Score': 7.586,
        'GDP per capita': 1.949,
        'Social support': 1.582,
        'Healthy life expectancy': 0.565,
        'Freedom to make life choices': 0.758,
        Generosity: 0.208,
        'Perceptions of corruption': 0.525,
        Year: 2023,
        Rank: 2
      }
    ];

    // Transform the data
    const transformedData: HappinessData[] = sampleData.map(item => ({
      countryYear: `${item.Year}`,
      country: item.Country,
      score: item['Happiness Score'],
      year: item.Year,
      rank: item.Rank,
      gdpPerCapita: item['GDP per capita'],
      socialSupport: item['Social support'],
      healthyLifeExpectancy: item['Healthy life expectancy'],
      freedomToMakeChoices: item['Freedom to make life choices'],
      generosity: item.Generosity,
      perceptionsOfCorruption: item['Perceptions of corruption']
    }));

    // Write to DynamoDB in batches
    const batchSize = 25;
    for (let i = 0; i < transformedData.length; i += batchSize) {
      const batch = transformedData.slice(i, i + batchSize);
      const command = new BatchWriteCommand({
        RequestItems: {
          [process.env.TABLE_NAME!]: batch.map(item => ({
            PutRequest: {
              Item: item
            }
          }))
        }
      });

      await docClient.send(command);
    }

    console.log('Successfully updated happiness data');
  } catch (error) {
    console.error('Error updating happiness data:', error);
    throw error;
  }
}; 