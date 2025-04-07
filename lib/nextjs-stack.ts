import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export class NextjsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create DynamoDB table for happiness data
    const happinessTable = new dynamodb.Table(this, 'HappinessTable', {
      partitionKey: { name: 'countryYear', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'country', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development only
    });

    // Add GSI for querying by year
    happinessTable.addGlobalSecondaryIndex({
      indexName: 'yearIndex',
      partitionKey: { name: 'year', type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: 'rank', type: dynamodb.AttributeType.NUMBER },
    });

    // Create a Lambda function for World Happiness Report data
    const worldHappinessFunction = new lambda.Function(this, 'WorldHappinessFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/world-happiness/dist'),
      environment: {
        TABLE_NAME: happinessTable.tableName,
        TABLE_YEAR_INDEX: 'yearIndex',
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
    });

    // Create a Lambda function for updating happiness data
    const worldHappinessUpdaterFunction = new lambda.Function(this, 'WorldHappinessUpdaterFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/world-happiness-updater/dist'),
      environment: {
        TABLE_NAME: happinessTable.tableName,
      },
      timeout: cdk.Duration.seconds(300), // 5 minutes
      memorySize: 1024,
    });

    // Create an EventBridge rule to trigger the updater function daily
    const rule = new events.Rule(this, 'WorldHappinessUpdateRule', {
      schedule: events.Schedule.rate(cdk.Duration.days(1)),
      targets: [new targets.LambdaFunction(worldHappinessUpdaterFunction)],
    });

    // Grant the Lambda functions access to DynamoDB
    happinessTable.grantReadData(worldHappinessFunction);
    happinessTable.grantWriteData(worldHappinessUpdaterFunction);

    // Create an API Gateway
    const api = new apigateway.RestApi(this, 'WellnessApi', {
      restApiName: 'Global Wellness API',
      description: 'API for Global Wellness Dashboard',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Add World Happiness endpoint
    const happiness = api.root.addResource('happiness');
    happiness.addMethod('GET', new apigateway.LambdaIntegration(worldHappinessFunction));

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
} 