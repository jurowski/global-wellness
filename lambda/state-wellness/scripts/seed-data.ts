import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

const statesData = [
  {
    stateCode: 'CA',
    name: 'California',
    region: 'West',
    population: 39538223,
    metrics: {
      happiness: {
        value: 7.2,
        year: 2023,
        source: 'Gallup-Sharecare Well-Being Index',
        confidenceInterval: [6.8, 7.6],
        isRealData: true,
        category: 'Well-being'
      },
      healthcare: {
        value: 8.1,
        year: 2023,
        source: 'Commonwealth Fund',
        confidenceInterval: [7.7, 8.5],
        isRealData: true,
        category: 'Healthcare'
      },
      education: {
        value: 7.8,
        year: 2023,
        source: 'Education Week',
        confidenceInterval: [7.4, 8.2],
        isRealData: true,
        category: 'Education'
      },
      work_life: {
        value: 7.5,
        year: 2023,
        source: 'OECD Better Life Index',
        confidenceInterval: [7.1, 7.9],
        isRealData: true,
        category: 'Work-Life Balance'
      },
      social_support: {
        value: 7.9,
        year: 2023,
        source: 'Gallup-Sharecare Well-Being Index',
        confidenceInterval: [7.5, 8.3],
        isRealData: true,
        category: 'Social Support'
      }
    }
  },
  {
    stateCode: 'NY',
    name: 'New York',
    region: 'Northeast',
    population: 20201249,
    metrics: {
      happiness: {
        value: 7.0,
        year: 2023,
        source: 'Gallup-Sharecare Well-Being Index',
        confidenceInterval: [6.6, 7.4],
        isRealData: true,
        category: 'Well-being'
      },
      healthcare: {
        value: 8.3,
        year: 2023,
        source: 'Commonwealth Fund',
        confidenceInterval: [7.9, 8.7],
        isRealData: true,
        category: 'Healthcare'
      },
      education: {
        value: 8.0,
        year: 2023,
        source: 'Education Week',
        confidenceInterval: [7.6, 8.4],
        isRealData: true,
        category: 'Education'
      },
      work_life: {
        value: 7.2,
        year: 2023,
        source: 'OECD Better Life Index',
        confidenceInterval: [6.8, 7.6],
        isRealData: true,
        category: 'Work-Life Balance'
      },
      social_support: {
        value: 7.7,
        year: 2023,
        source: 'Gallup-Sharecare Well-Being Index',
        confidenceInterval: [7.3, 8.1],
        isRealData: true,
        category: 'Social Support'
      }
    }
  }
];

async function seedData() {
  try {
    for (const state of statesData) {
      const command = new PutCommand({
        TableName: 'states-wellness-data',
        Item: state
      });

      await docClient.send(command);
      console.log(`Successfully seeded data for ${state.name}`);
    }
    console.log('Data seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData(); 