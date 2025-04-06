import { Metric, Alarm, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';
import { Duration } from 'aws-cdk-lib';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { setupUNFetcherNotifications } from './notifications';
import { createUNFetcherDashboard } from './dashboard';

export interface UNFetcherMonitoringProps {
  emailAddresses: string[];
}

export function setupUNFetcherMonitoring(scope: any, lambdaFunction: IFunction, props: UNFetcherMonitoringProps) {
  // Error rate alarm
  const errorRateMetric = new Metric({
    namespace: 'AWS/Lambda',
    metricName: 'Errors',
    dimensionsMap: {
      FunctionName: lambdaFunction.functionName
    },
    statistic: 'Sum',
    period: Duration.minutes(5)
  });

  const errorRateAlarm = new Alarm(scope, 'UNFetcherErrorRateAlarm', {
    metric: errorRateMetric,
    threshold: 1,
    evaluationPeriods: 1,
    alarmDescription: 'Alarm when UN fetcher Lambda has errors',
    treatMissingData: TreatMissingData.NOT_BREACHING
  });

  // Duration alarm
  const durationMetric = new Metric({
    namespace: 'AWS/Lambda',
    metricName: 'Duration',
    dimensionsMap: {
      FunctionName: lambdaFunction.functionName
    },
    statistic: 'Maximum',
    period: Duration.minutes(5)
  });

  const durationAlarm = new Alarm(scope, 'UNFetcherDurationAlarm', {
    metric: durationMetric,
    threshold: 30000, // 30 seconds
    evaluationPeriods: 1,
    alarmDescription: 'Alarm when UN fetcher Lambda takes too long',
    treatMissingData: TreatMissingData.NOT_BREACHING
  });

  // Throttles alarm
  const throttlesMetric = new Metric({
    namespace: 'AWS/Lambda',
    metricName: 'Throttles',
    dimensionsMap: {
      FunctionName: lambdaFunction.functionName
    },
    statistic: 'Sum',
    period: Duration.minutes(5)
  });

  const throttlesAlarm = new Alarm(scope, 'UNFetcherThrottlesAlarm', {
    metric: throttlesMetric,
    threshold: 1,
    evaluationPeriods: 1,
    alarmDescription: 'Alarm when UN fetcher Lambda is throttled',
    treatMissingData: TreatMissingData.NOT_BREACHING
  });

  // Memory usage alarm
  const memoryUsageMetric = new Metric({
    namespace: 'AWS/Lambda',
    metricName: 'MemoryUtilization',
    dimensionsMap: {
      FunctionName: lambdaFunction.functionName
    },
    statistic: 'Maximum',
    period: Duration.minutes(5)
  });

  const memoryUsageAlarm = new Alarm(scope, 'UNFetcherMemoryUsageAlarm', {
    metric: memoryUsageMetric,
    threshold: 80, // 80% memory utilization
    evaluationPeriods: 3,
    alarmDescription: 'Alarm when UN fetcher Lambda memory usage is high',
    treatMissingData: TreatMissingData.NOT_BREACHING
  });

  // Concurrent executions alarm
  const concurrentExecutionsMetric = new Metric({
    namespace: 'AWS/Lambda',
    metricName: 'ConcurrentExecutions',
    dimensionsMap: {
      FunctionName: lambdaFunction.functionName
    },
    statistic: 'Maximum',
    period: Duration.minutes(5)
  });

  const concurrentExecutionsAlarm = new Alarm(scope, 'UNFetcherConcurrentExecutionsAlarm', {
    metric: concurrentExecutionsMetric,
    threshold: 100, // 100 concurrent executions
    evaluationPeriods: 2,
    alarmDescription: 'Alarm when UN fetcher Lambda concurrent executions are high',
    treatMissingData: TreatMissingData.NOT_BREACHING
  });

  // API latency alarm
  const apiLatencyMetric = new Metric({
    namespace: 'Custom/UNFetcher',
    metricName: 'APILatency',
    dimensionsMap: {
      FunctionName: lambdaFunction.functionName
    },
    statistic: 'Average',
    period: Duration.minutes(5)
  });

  const apiLatencyAlarm = new Alarm(scope, 'UNFetcherAPILatencyAlarm', {
    metric: apiLatencyMetric,
    threshold: 5000, // 5 seconds
    evaluationPeriods: 2,
    alarmDescription: 'Alarm when UN API latency is high',
    treatMissingData: TreatMissingData.NOT_BREACHING
  });

  // Custom metrics for data quality
  const dataQualityMetric = new Metric({
    namespace: 'Custom/UNFetcher',
    metricName: 'DataQuality',
    dimensionsMap: {
      FunctionName: lambdaFunction.functionName
    },
    statistic: 'Average',
    period: Duration.minutes(5)
  });

  const dataQualityAlarm = new Alarm(scope, 'UNFetcherDataQualityAlarm', {
    metric: dataQualityMetric,
    threshold: 0.9, // 90% data quality threshold
    evaluationPeriods: 3,
    alarmDescription: 'Alarm when UN fetcher data quality drops below threshold',
    treatMissingData: TreatMissingData.BREACHING
  });

  // API error rate alarm
  const apiErrorMetric = new Metric({
    namespace: 'Custom/UNFetcher',
    metricName: 'APIErrorRate',
    dimensionsMap: {
      FunctionName: lambdaFunction.functionName
    },
    statistic: 'Sum',
    period: Duration.minutes(5)
  });

  const apiErrorAlarm = new Alarm(scope, 'UNFetcherAPIErrorAlarm', {
    metric: apiErrorMetric,
    threshold: 3, // 3 API errors in 5 minutes
    evaluationPeriods: 2,
    alarmDescription: 'Alarm when UN API error rate is high',
    treatMissingData: TreatMissingData.NOT_BREACHING
  });

  // Data validation error alarm
  const validationErrorMetric = new Metric({
    namespace: 'Custom/UNFetcher',
    metricName: 'ValidationErrors',
    dimensionsMap: {
      FunctionName: lambdaFunction.functionName
    },
    statistic: 'Sum',
    period: Duration.minutes(5)
  });

  const validationErrorAlarm = new Alarm(scope, 'UNFetcherValidationErrorAlarm', {
    metric: validationErrorMetric,
    threshold: 5, // 5 validation errors in 5 minutes
    evaluationPeriods: 2,
    alarmDescription: 'Alarm when data validation errors are high',
    treatMissingData: TreatMissingData.NOT_BREACHING
  });

  // Data completeness alarm
  const completenessMetric = new Metric({
    namespace: 'Custom/UNFetcher',
    metricName: 'DataCompleteness',
    dimensionsMap: {
      FunctionName: lambdaFunction.functionName
    },
    statistic: 'Average',
    period: Duration.minutes(5)
  });

  const completenessAlarm = new Alarm(scope, 'UNFetcherCompletenessAlarm', {
    metric: completenessMetric,
    threshold: 0.95, // 95% data completeness threshold
    evaluationPeriods: 3,
    alarmDescription: 'Alarm when data completeness drops below threshold',
    treatMissingData: TreatMissingData.BREACHING
  });

  // Data freshness alarm
  const freshnessMetric = new Metric({
    namespace: 'Custom/UNFetcher',
    metricName: 'DataFreshness',
    dimensionsMap: {
      FunctionName: lambdaFunction.functionName
    },
    statistic: 'Maximum',
    period: Duration.minutes(5)
  });

  const freshnessAlarm = new Alarm(scope, 'UNFetcherFreshnessAlarm', {
    metric: freshnessMetric,
    threshold: 86400, // 24 hours in seconds
    evaluationPeriods: 2,
    alarmDescription: 'Alarm when data is not fresh',
    treatMissingData: TreatMissingData.BREACHING
  });

  // Set up notifications
  const notifications = setupUNFetcherNotifications(scope, {
    errorRateAlarm,
    durationAlarm,
    throttlesAlarm,
    dataQualityAlarm,
    memoryUsageAlarm,
    concurrentExecutionsAlarm,
    apiLatencyAlarm,
    apiErrorAlarm,
    validationErrorAlarm,
    completenessAlarm,
    freshnessAlarm,
    emailAddresses: props.emailAddresses
  });

  // Create dashboard
  const dashboard = createUNFetcherDashboard(scope, {
    lambdaFunction
  });

  return {
    errorRateAlarm,
    durationAlarm,
    throttlesAlarm,
    dataQualityAlarm,
    memoryUsageAlarm,
    concurrentExecutionsAlarm,
    apiLatencyAlarm,
    apiErrorAlarm,
    validationErrorAlarm,
    completenessAlarm,
    freshnessAlarm,
    notifications,
    dashboard
  };
} 