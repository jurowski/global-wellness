import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as msk from 'aws-cdk-lib/aws-msk';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class WellnessInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket for raw data storage
    const dataBucket = new s3.Bucket(this, 'WellnessDataBucket', {
      bucketName: 'wellness-data-lake',
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(365),
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(90)
            }
          ]
        }
      ]
    });

    // DynamoDB tables
    const metricsTable = new dynamodb.Table(this, 'WellnessMetrics', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    // Add GSIs
    metricsTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'gsi1pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'gsi1sk', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL
    });

    // MSK Cluster
    const kafkaCluster = new msk.Cluster(this, 'WellnessKafka', {
      clusterName: 'wellness-kafka',
      kafkaVersion: msk.KafkaVersion.V3_4_0,
      numberOfBrokerNodes: 3,
      instanceType: 'kafka.t3.small',
      encryptionInTransit: {
        clientBroker: msk.ClientBrokerEncryption.TLS,
        inCluster: true
      }
    });

    // Lambda role with necessary permissions
    const lambdaRole = new iam.Role(this, 'WellnessLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    });

    // Add permissions to the Lambda role
    dataBucket.grantReadWrite(lambdaRole);
    metricsTable.grantReadWriteData(lambdaRole);
    kafkaCluster.grantWrite(lambdaRole);

    // Create Lambda functions for each fetcher
    const fetchers = [
      'WHO', 'OECD', 'UN', 'WorldBank', 'WorldHappiness', 'IMF', 'WEF', 
      'Gallup', 'WVS', 'ESS', 'EQLS', 'Eurostat'
    ];

    const lambdaFunctions: { [key: string]: lambda.Function } = {};

    fetchers.forEach(source => {
      lambdaFunctions[source] = new lambda.Function(this, `${source}Fetcher`, {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, `../lambda/${source.toLowerCase()}`)),
        environment: {
          KAFKA_BROKERS: kafkaCluster.bootstrapBrokers,
          METRICS_TABLE: metricsTable.tableName,
          DATA_BUCKET: dataBucket.bucketName
        },
        role: lambdaRole,
        timeout: cdk.Duration.minutes(5),
        memorySize: 1024
      });
    });

    // Create EventBridge rules for scheduling
    const dailySchedule = new events.Rule(this, 'DailyFetchSchedule', {
      schedule: events.Schedule.cron({ minute: '0', hour: '0' }) // Daily at midnight UTC
    });

    // Add Lambda functions as targets
    Object.values(lambdaFunctions).forEach(lambda => {
      dailySchedule.addTarget(new targets.LambdaFunction(lambda));
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'WellnessAPI', {
      restApiName: 'Wellness Data API',
      description: 'API for accessing wellness data',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      }
    });

    // Add API resources and methods
    const wellnessData = api.root.addResource('wellness-data');
    wellnessData.addMethod('GET', new apigateway.LambdaIntegration(lambdaFunctions.WHO));

    // Output important information
    new cdk.CfnOutput(this, 'KafkaBrokers', {
      value: kafkaCluster.bootstrapBrokers,
      description: 'Kafka Brokers connection string'
    });

    new cdk.CfnOutput(this, 'MetricsTableName', {
      value: metricsTable.tableName,
      description: 'DynamoDB table name for metrics'
    });

    new cdk.CfnOutput(this, 'DataBucketName', {
      value: dataBucket.bucketName,
      description: 'S3 bucket name for raw data'
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL'
    });
  }
} 