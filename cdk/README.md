# Wellness Data Infrastructure

This project contains the AWS infrastructure for the Wellness Data platform, built using AWS CDK.

## Architecture

The infrastructure consists of:

1. **Data Fetchers (Lambda Functions)**
   - WHO Data Fetcher
   - OECD Data Fetcher
   - UN Data Fetcher
   - World Bank Data Fetcher
   - And more...

2. **Data Processing**
   - Amazon MSK (Managed Streaming for Kafka)
   - Processor Lambda Function
   - DynamoDB for processed data storage
   - S3 for raw data storage

3. **API Layer**
   - API Gateway
   - Lambda Functions for data access

## Prerequisites

- Node.js 18.x or later
- AWS CDK CLI
- AWS CLI configured with appropriate credentials
- AWS account with necessary permissions

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy the infrastructure:
   ```bash
   npx cdk deploy
   ```

## Development

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and compile
- `npm run test` - Run unit tests
- `npx cdk deploy` - Deploy to AWS
- `npx cdk diff` - Compare deployed stack with current state
- `npx cdk synth` - Emit the synthesized CloudFormation template

## Lambda Functions

Each data fetcher Lambda function is located in the `lambda/` directory. The functions:

1. Fetch data from their respective sources
2. Store raw data in S3
3. Publish processed data to Kafka
4. Store processed data in DynamoDB

## Security

- All data is encrypted at rest
- Data in transit is encrypted using TLS
- IAM roles follow the principle of least privilege
- VPC is used for network isolation
- Security groups control network access

## Monitoring

- CloudWatch Logs for Lambda functions
- CloudWatch Metrics for resource utilization
- CloudWatch Alarms for error detection
- X-Ray for tracing requests

## Cost Optimization

- DynamoDB on-demand capacity
- S3 lifecycle rules for data archiving
- Lambda function memory optimization
- MSK broker instance type selection

## Maintenance

- Regular updates to dependencies
- Security patches applied automatically
- Backup and disaster recovery procedures
- Performance monitoring and optimization
