#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WellnessInfraStack } from '../lib/wellness-stack';

const app = new cdk.App();
new WellnessInfraStack(app, 'WellnessInfraStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
}); 