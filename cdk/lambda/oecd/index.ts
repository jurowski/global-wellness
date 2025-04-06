import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Kafka } from 'kafkajs';

const s3Client = new S3Client({});
const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const kafka = new Kafka({
  clientId: 'oecd-fetcher',
  brokers: process.env.KAFKA_BROKERS?.split(',') || []
});

const producer = kafka.producer();

interface OECDMetric {
  name: string;
  value: number;
  validity: string;
  unit: string;
}

interface OECDEvent {
  countries?: string[];
  year?: number;
}

export const handler = async (event: OECDEvent) => {
  try {
    // Initialize Kafka producer
    await producer.connect();

    // OECD metrics mapping
    const metrics = {
      'gdp_per_capita': 'GDP',
      'income_inequality': 'INEQ',
      'employment_rate': 'EMP',
      'unemployment_rate': 'UNEMP',
      'poverty_rate': 'POV',
      'education_attainment': 'EDU',
      'life_satisfaction': 'SWB',
      'work_life_balance': 'WLB',
      'environmental_quality': 'ENV',
      'social_support': 'SOC',
      'civic_engagement': 'CIV',
      'health_status': 'HLTH'
    };

    const countries = event.countries || ['USA', 'GBR', 'FRA', 'DEU', 'JPN'];
    const year = event.year || new Date().getFullYear();
    
    const data: Record<string, OECDMetric> = {};
    
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
    const s3Key = `oecd/raw/${year}/${Date.now()}.json`;
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
          sk: `${metricName}#OECD`,
          gsi1pk: `${metricName}#OECD`,
          gsi1sk: `${year}#${metric.value}`,
          ...metric,
          source: 'OECD',
          timestamp: new Date().toISOString(),
          ttl: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60 // 1 year TTL
        }
      }));
    }

    // Send to Kafka
    await producer.send({
      topic: 'wellness.raw',
      messages: [{
        key: 'OECD',
        value: JSON.stringify({
          source: 'OECD',
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
        message: 'Error processing OECD data',
        error: error instanceof Error ? error.message : String(error)
      })
    };
  } finally {
    await producer.disconnect();
  }
};

function getUnitForMetric(metric: string): string {
  const units: Record<string, string> = {
    'gdp_per_capita': 'USD',
    'income_inequality': 'Gini coefficient',
    'employment_rate': 'percentage',
    'unemployment_rate': 'percentage',
    'poverty_rate': 'percentage',
    'education_attainment': 'years',
    'life_satisfaction': 'scale 0-10',
    'work_life_balance': 'hours',
    'environmental_quality': 'index',
    'social_support': 'percentage',
    'civic_engagement': 'percentage',
    'health_status': 'index'
  };
  return units[metric] || 'units';
} 