import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Kafka } from 'kafkajs';

const s3Client = new S3Client({});
const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const kafka = new Kafka({
  clientId: 'who-fetcher',
  brokers: process.env.KAFKA_BROKERS?.split(',') || []
});

const producer = kafka.producer();

interface WHOMetric {
  name: string;
  value: number;
  validity: string;
  unit: string;
}

interface WHOEvent {
  countries?: string[];
  year?: number;
}

export const handler = async (event: WHOEvent) => {
  try {
    // Initialize Kafka producer
    await producer.connect();

    // Mock WHO data fetching (replace with actual API call)
    const metrics = {
      'life_expectancy': 'GHO',
      'healthy_life_expectancy': 'GHO',
      'mortality_rate': 'GHO',
      'health_expenditure': 'GHO',
      'physicians_density': 'GHO',
      'hospital_beds': 'GHO',
      'immunization_coverage': 'GHO',
      'prevalence_of_obesity': 'GHO',
      'prevalence_of_depression': 'GHO',
      'suicide_rate': 'GHO',
      'alcohol_consumption': 'GHO',
      'tobacco_use': 'GHO'
    };

    const countries = event.countries || ['USA', 'GBR', 'FRA', 'DEU', 'JPN'];
    const year = event.year || new Date().getFullYear();
    
    const data: Record<string, WHOMetric> = {};
    
    // Generate mock data for each country and metric
    countries.forEach((country: string) => {
      Object.keys(metrics).forEach(metric => {
        const metricKey = `${country}_${metric}`;
        data[metricKey] = {
          name: metric,
          value: Math.random() * 100, // Mock value
          validity: 'valid',
          unit: getUnitForMetric(metric)
        };
      });
    });

    // Store raw data in S3
    const s3Key = `who/raw/${year}/${Date.now()}.json`;
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.DATA_BUCKET,
      Key: s3Key,
      Body: JSON.stringify(data),
      ContentType: 'application/json'
    }));

    // Store processed data in DynamoDB
    for (const [key, metric] of Object.entries(data)) {
      const [country, metricName] = key.split('_');
      await ddbDocClient.send(new PutCommand({
        TableName: process.env.METRICS_TABLE,
        Item: {
          pk: `${country}#${year}`,
          sk: `${metricName}#WHO`,
          gsi1pk: `${metricName}#WHO`,
          gsi1sk: `${year}#${metric.value}`,
          ...metric,
          source: 'WHO',
          timestamp: new Date().toISOString(),
          ttl: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60 // 1 year TTL
        }
      }));
    }

    // Send to Kafka
    await producer.send({
      topic: 'wellness.raw',
      messages: [{
        key: 'WHO',
        value: JSON.stringify({
          source: 'WHO',
          timestamp: new Date().toISOString(),
          data
        })
      }]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Data fetched and processed successfully',
        metrics: Object.keys(data).length
      })
    };
  } catch (error: unknown) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing WHO data',
        error: error instanceof Error ? error.message : String(error)
      })
    };
  } finally {
    await producer.disconnect();
  }
};

function getUnitForMetric(metric: string): string {
  const units: Record<string, string> = {
    'life_expectancy': 'years',
    'healthy_life_expectancy': 'years',
    'mortality_rate': 'per 100,000',
    'health_expenditure': 'USD',
    'physicians_density': 'per 1,000',
    'hospital_beds': 'per 1,000',
    'immunization_coverage': 'percentage',
    'prevalence_of_obesity': 'percentage',
    'prevalence_of_depression': 'percentage',
    'suicide_rate': 'per 100,000',
    'alcohol_consumption': 'liters per capita',
    'tobacco_use': 'percentage'
  };
  return units[metric] || 'units';
} 