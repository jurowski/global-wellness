import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Kafka, KafkaMessage, EachMessagePayload } from 'kafkajs';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const kafka = new Kafka({
  clientId: 'wellness-processor',
  brokers: process.env.KAFKA_BROKERS?.split(',') || []
});

const consumer = kafka.consumer({ groupId: 'wellness-processor' });

interface WellnessMetric {
  name: string;
  value: number;
  validity: string;
  unit: string;
}

interface KafkaMessageData {
  source: string;
  timestamp: string;
  data: Record<string, WellnessMetric>;
}

export const handler = async (event: any) => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topics: ['wellness.raw'], fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        if (!message.value) return;

        const data: KafkaMessageData = JSON.parse(message.value.toString());
        const { source, timestamp, data: metrics } = data;

        // Process each metric
        for (const [key, metric] of Object.entries(metrics)) {
          const [country, metricName] = key.split('_');
          const year = new Date(timestamp).getFullYear();

          // Get historical data for trend analysis
          const historicalData = await ddbDocClient.send(new QueryCommand({
            TableName: process.env.METRICS_TABLE,
            KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
            ExpressionAttributeValues: {
              ':pk': `${country}#${year}`,
              ':sk': `${metricName}#`
            }
          }));

          // Calculate trend if historical data exists
          let trend = 0;
          if (historicalData.Items && historicalData.Items.length > 0) {
            const previousValues = historicalData.Items
              .map((item: { value: number }) => item.value)
              .sort((a: number, b: number) => b - a);
            
            const previousAvg = previousValues.reduce((a: number, b: number) => a + b, 0) / previousValues.length;
            trend = metric.value - previousAvg;
          }

          // Store processed data with trend analysis
          await ddbDocClient.send(new PutCommand({
            TableName: process.env.METRICS_TABLE,
            Item: {
              pk: `${country}#${year}`,
              sk: `${metricName}#${source}#PROCESSED`,
              gsi1pk: `${metricName}#${source}#PROCESSED`,
              gsi1sk: `${year}#${metric.value}`,
              ...metric,
              trend,
              source,
              timestamp,
              ttl: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60 // 1 year TTL
            }
          }));
        }
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Data processed successfully'
      })
    };
  } catch (error: unknown) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing data',
        error: error instanceof Error ? error.message : String(error)
      })
    };
  } finally {
    await consumer.disconnect();
  }
}; 