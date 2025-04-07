#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NextjsStack } from '../lib/nextjs-stack';

const app = new cdk.App();
new NextjsStack(app, 'GlobalWellnessStack2', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
}); 