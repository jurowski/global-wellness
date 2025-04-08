# State Wellness Lambda Function

This Lambda function fetches and serves state wellness data through an API Gateway endpoint.

## Prerequisites

- Node.js 18.x
- AWS CLI configured with appropriate credentials
- AWS SAM CLI installed
- AWS IAM permissions for Lambda, API Gateway, and DynamoDB

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your AWS configuration
```

3. Build the function:
```bash
npm run build
```

## Deployment

Deploy using the deployment script:
```bash
./deploy.sh
```

Or deploy manually:
```bash
sam build
sam deploy --guided
```

## Testing

Run tests:
```bash
npm test
```

## API Endpoints

- GET `/state-wellness-data` - Fetch wellness data for all states
- GET `/state-wellness-data?stateCodes=CA,NY` - Fetch wellness data for specific states

## Architecture

- Lambda Function: Node.js 18.x runtime
- API Gateway: REST API
- DynamoDB: Single-table design with stateCode as partition key
- IAM: Least privilege permissions

## Monitoring

- CloudWatch Logs: `/aws/lambda/state-wellness`
- CloudWatch Metrics: Lambda invocation metrics
- X-Ray: API Gateway and Lambda tracing

## Security

- IAM roles with least privilege
- API Gateway authentication
- Environment variables for sensitive data
- VPC configuration (if needed) 