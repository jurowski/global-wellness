import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Kafka } from 'kafkajs';
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';

const s3Client = new S3Client({});
const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const cloudWatchClient = new CloudWatchClient({});

const kafka = new Kafka({
  clientId: 'un-fetcher',
  brokers: process.env.KAFKA_BROKERS?.split(',') || []
});

const producer = kafka.producer();

interface UNMetric {
  name: string;
  value: number;
  validity: string;
  unit: string;
}

interface UNEvent {
  countries?: string[];
  year?: number;
}

async function emitDataQualityMetric(validMetrics: number, totalMetrics: number) {
  const qualityScore = validMetrics / totalMetrics;
  await cloudWatchClient.send(new PutMetricDataCommand({
    Namespace: 'Custom/UNFetcher',
    MetricData: [{
      MetricName: 'DataQuality',
      Value: qualityScore,
      Unit: 'Count',
      Dimensions: [{
        Name: 'FunctionName',
        Value: process.env.AWS_LAMBDA_FUNCTION_NAME || 'UNFetcher'
      }]
    }]
  }));
}

export const handler = async (event: UNEvent) => {
  try {
    // Initialize Kafka producer
    await producer.connect();

    // UN metrics mapping
    const metrics = {
      'human_development_index': 'HDI',
      'life_expectancy': 'HDI',
      'education_index': 'HDI',
      'gni_per_capita': 'HDI',
      'gender_inequality_index': 'GII',
      'maternal_mortality': 'GII',
      'adolescent_birth_rate': 'GII',
      'parliamentary_representation': 'GII',
      'secondary_education': 'GII',
      'labor_force_participation': 'GII',
      'multidimensional_poverty': 'MPI',
      'sustainable_development': 'SDG'
    };

    const countries = event.countries || ['USA', 'GBR', 'FRA', 'DEU', 'JPN'];
    const year = event.year || new Date().getFullYear();
    
    const data: Record<string, UNMetric> = {};
    let validMetrics = 0;
    const totalMetrics = countries.length * Object.keys(metrics).length;
    
    // Generate mock data for each country and metric
    countries.forEach((country: string) => {
      Object.keys(metrics).forEach(metric => {
        const metricKey = `${country}_${metric}`;
        const value = Math.random() * 100; // Mock value
        const isValid = value >= 0 && value <= 100;
        data[metricKey] = {
          name: metric,
          value,
          validity: isValid ? 'valid' : 'invalid',
          unit: getUnitForMetric(metric)
        };
        if (isValid) validMetrics++;
      });
    });

    // Emit data quality metric
    await emitDataQualityMetric(validMetrics, totalMetrics);

    // Store raw data in S3
    const s3Key = `un/raw/${year}/${Date.now()}.json`;
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
          sk: `${metricName}#UN`,
          gsi1pk: `${metricName}#UN`,
          gsi1sk: `${year}#${metric.value}`,
          ...metric,
          source: 'UN',
          timestamp: new Date().toISOString(),
          ttl: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60 // 1 year TTL
        }
      }));
    }

    // Send to Kafka
    await producer.send({
      topic: 'wellness.raw',
      messages: [{
        key: 'UN',
        value: JSON.stringify({
          source: 'UN',
          timestamp: new Date().toISOString(),
          data
        })
      }]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Data fetched and processed successfully',
        metrics: Object.keys(data).length,
        dataQuality: validMetrics / totalMetrics
      })
    };
  } catch (error: unknown) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing UN data',
        error: error instanceof Error ? error.message : String(error)
      })
    };
  } finally {
    await producer.disconnect();
  }
};

function getUnitForMetric(metric: string): string {
  const units: Record<string, string> = {
    'human_development_index': 'index',
    'life_expectancy': 'years',
    'education_index': 'index',
    'gni_per_capita': 'USD',
    'gender_inequality_index': 'index',
    'maternal_mortality': 'per 100,000',
    'adolescent_birth_rate': 'per 1,000',
    'parliamentary_representation': 'percentage',
    'secondary_education': 'percentage',
    'labor_force_participation': 'percentage',
    'multidimensional_poverty': 'percentage',
    'sustainable_development': 'index'
  };
  return units[metric] || 'units';
} 