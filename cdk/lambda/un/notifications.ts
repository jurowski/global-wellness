import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Construct } from 'constructs';
import { Alarm, ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';

export interface UNFetcherNotificationsProps {
  errorRateAlarm: Alarm;
  durationAlarm: Alarm;
  throttlesAlarm: Alarm;
  dataQualityAlarm: Alarm;
  memoryUsageAlarm: Alarm;
  concurrentExecutionsAlarm: Alarm;
  apiLatencyAlarm: Alarm;
  apiErrorAlarm: Alarm;
  validationErrorAlarm: Alarm;
  completenessAlarm: Alarm;
  freshnessAlarm: Alarm;
  emailAddresses: string[];
}

const ERROR_RATE_DESCRIPTION = `
UN Data Fetcher Error Rate Alert

Potential causes:
- API rate limiting
- Network connectivity issues
- Invalid data format

Actions to take:
1. Check CloudWatch logs for error details
2. Verify API endpoints are accessible
3. Review data validation rules
`;

const DURATION_DESCRIPTION = `
UN Data Fetcher Duration Alert

Potential causes:
- Slow API response times
- Large data payload
- Resource constraints

Actions to take:
1. Check API response times
2. Review data volume
3. Consider increasing Lambda memory/timeout
`;

const THROTTLES_DESCRIPTION = `
UN Data Fetcher Throttling Alert

Potential causes:
- Concurrent execution limit reached
- Resource constraints

Actions to take:
1. Review concurrent execution settings
2. Check Lambda quotas
3. Consider increasing concurrency limit
`;

const MEMORY_USAGE_DESCRIPTION = `
UN Data Fetcher Memory Usage Alert

Potential causes:
- Large data processing
- Memory leaks
- Insufficient memory allocation

Actions to take:
1. Review memory-intensive operations
2. Check for memory leaks
3. Consider increasing Lambda memory
`;

const CONCURRENT_EXECUTIONS_DESCRIPTION = `
UN Data Fetcher Concurrent Executions Alert

Potential causes:
- High request volume
- Long-running executions
- Rate limiting issues

Actions to take:
1. Review execution patterns
2. Check for stuck executions
3. Consider adjusting concurrency limits
`;

const API_LATENCY_DESCRIPTION = `
UN API Latency Alert

Potential causes:
- UN API performance issues
- Network connectivity problems
- Rate limiting

Actions to take:
1. Check UN API status
2. Review network connectivity
3. Consider implementing retry logic
`;

const API_ERROR_DESCRIPTION = `
UN API Error Alert

Potential causes:
- API authentication issues
- Invalid request parameters
- Service unavailability

Actions to take:
1. Check API credentials
2. Review request parameters
3. Verify API service status
`;

const VALIDATION_ERROR_DESCRIPTION = `
Data Validation Error Alert

Potential causes:
- Schema changes
- Data format issues
- Missing required fields

Actions to take:
1. Review data schema
2. Check data transformation logic
3. Update validation rules
`;

const COMPLETENESS_DESCRIPTION = `
Data Completeness Alert

Potential causes:
- Missing data sources
- Failed data collection
- Incomplete data processing

Actions to take:
1. Check data source availability
2. Review collection process
3. Verify processing logic
`;

const FRESHNESS_DESCRIPTION = `
Data Freshness Alert

Potential causes:
- Scheduled jobs not running
- Processing delays
- Data source issues

Actions to take:
1. Check job schedules
2. Review processing pipeline
3. Verify data source updates
`;

const DATA_QUALITY_DESCRIPTION = `
UN Data Quality Alert

Potential causes:
- Data source format changes
- Invalid or missing data
- Data transformation errors

Actions to take:
1. Review data source format
2. Check data validation rules
3. Verify transformation logic
`;

export function setupUNFetcherNotifications(scope: Construct, props: UNFetcherNotificationsProps) {
  // Create SNS topic for UN fetcher alerts
  const alertTopic = new Topic(scope, 'UNFetcherAlertTopic', {
    displayName: 'UN Data Fetcher Alerts',
    topicName: 'un-fetcher-alerts'
  });

  // Add email subscriptions
  props.emailAddresses.forEach((email) => {
    alertTopic.addSubscription(
      new EmailSubscription(email)
    );
  });

  // Create SNS action
  const snsAction = new SnsAction(alertTopic);

  // Add SNS actions and descriptions to existing alarms
  props.errorRateAlarm.addAlarmAction(snsAction);
  props.errorRateAlarm.node.addMetadata('description', ERROR_RATE_DESCRIPTION);

  props.durationAlarm.addAlarmAction(snsAction);
  props.durationAlarm.node.addMetadata('description', DURATION_DESCRIPTION);

  props.throttlesAlarm.addAlarmAction(snsAction);
  props.throttlesAlarm.node.addMetadata('description', THROTTLES_DESCRIPTION);

  props.memoryUsageAlarm.addAlarmAction(snsAction);
  props.memoryUsageAlarm.node.addMetadata('description', MEMORY_USAGE_DESCRIPTION);

  props.concurrentExecutionsAlarm.addAlarmAction(snsAction);
  props.concurrentExecutionsAlarm.node.addMetadata('description', CONCURRENT_EXECUTIONS_DESCRIPTION);

  props.apiLatencyAlarm.addAlarmAction(snsAction);
  props.apiLatencyAlarm.node.addMetadata('description', API_LATENCY_DESCRIPTION);

  props.apiErrorAlarm.addAlarmAction(snsAction);
  props.apiErrorAlarm.node.addMetadata('description', API_ERROR_DESCRIPTION);

  props.validationErrorAlarm.addAlarmAction(snsAction);
  props.validationErrorAlarm.node.addMetadata('description', VALIDATION_ERROR_DESCRIPTION);

  props.completenessAlarm.addAlarmAction(snsAction);
  props.completenessAlarm.node.addMetadata('description', COMPLETENESS_DESCRIPTION);

  props.freshnessAlarm.addAlarmAction(snsAction);
  props.freshnessAlarm.node.addMetadata('description', FRESHNESS_DESCRIPTION);

  props.dataQualityAlarm.addAlarmAction(snsAction);
  props.dataQualityAlarm.node.addMetadata('description', DATA_QUALITY_DESCRIPTION);

  return {
    alertTopic,
    snsAction
  };
} 