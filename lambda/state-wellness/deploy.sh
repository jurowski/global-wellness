#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the Lambda function
echo "Building Lambda function..."
npm run build

# Deploy using AWS SAM
echo "Deploying to AWS..."
sam deploy --template-file template.yaml --stack-name state-wellness-stack --capabilities CAPABILITY_IAM --guided

# Wait for deployment to complete
echo "Waiting for deployment to complete..."
sleep 30

# Seed the data
echo "Seeding data..."
./scripts/seed.sh

echo "Deployment complete!" 