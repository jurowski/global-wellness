import { Dashboard, TextWidget, GraphWidget, Metric, PeriodOverride } from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';

export interface UNFetcherDashboardProps {
  lambdaFunction: IFunction;
}

export function createUNFetcherDashboard(scope: Construct, props: UNFetcherDashboardProps) {
  // Create the dashboard
  const dashboard = new Dashboard(scope, 'UNFetcherDashboard', {
    dashboardName: 'UN-Fetcher-Metrics',
    periodOverride: PeriodOverride.AUTO
  });

  // Add title widget
  dashboard.addWidgets(
    new TextWidget({
      markdown: '# UN Data Fetcher Metrics',
      width: 24,
      height: 1
    })
  );

  // Performance metrics widget
  const performanceWidget = new GraphWidget({
    title: 'Performance Metrics',
    left: [
      new Metric({
        namespace: 'AWS/Lambda',
        metricName: 'Duration',
        dimensionsMap: {
          FunctionName: props.lambdaFunction.functionName
        },
        statistic: 'Average',
        label: 'Duration (ms)'
      }),
      new Metric({
        namespace: 'AWS/Lambda',
        metricName: 'ConcurrentExecutions',
        dimensionsMap: {
          FunctionName: props.lambdaFunction.functionName
        },
        statistic: 'Maximum',
        label: 'Concurrent Executions'
      })
    ],
    width: 12,
    height: 6
  });

  // Resource utilization widget
  const resourceWidget = new GraphWidget({
    title: 'Resource Utilization',
    left: [
      new Metric({
        namespace: 'AWS/Lambda',
        metricName: 'MemoryUtilization',
        dimensionsMap: {
          FunctionName: props.lambdaFunction.functionName
        },
        statistic: 'Average',
        label: 'Memory Utilization (%)'
      })
    ],
    width: 12,
    height: 6
  });

  // Error metrics widget
  const errorWidget = new GraphWidget({
    title: 'Error Metrics',
    left: [
      new Metric({
        namespace: 'AWS/Lambda',
        metricName: 'Errors',
        dimensionsMap: {
          FunctionName: props.lambdaFunction.functionName
        },
        statistic: 'Sum',
        label: 'Errors'
      }),
      new Metric({
        namespace: 'AWS/Lambda',
        metricName: 'Throttles',
        dimensionsMap: {
          FunctionName: props.lambdaFunction.functionName
        },
        statistic: 'Sum',
        label: 'Throttles'
      })
    ],
    width: 12,
    height: 6
  });

  // API metrics widget
  const apiWidget = new GraphWidget({
    title: 'API Metrics',
    left: [
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'APILatency',
        dimensionsMap: {
          FunctionName: props.lambdaFunction.functionName
        },
        statistic: 'Average',
        label: 'API Latency (ms)'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'APIErrorRate',
        dimensionsMap: {
          FunctionName: props.lambdaFunction.functionName
        },
        statistic: 'Sum',
        label: 'API Errors'
      })
    ],
    width: 12,
    height: 6
  });

  // Data quality metrics widget
  const dataQualityWidget = new GraphWidget({
    title: 'Data Quality Metrics',
    left: [
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'DataQuality',
        dimensionsMap: {
          FunctionName: props.lambdaFunction.functionName
        },
        statistic: 'Average',
        label: 'Data Quality Score'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'ValidationErrors',
        dimensionsMap: {
          FunctionName: props.lambdaFunction.functionName
        },
        statistic: 'Sum',
        label: 'Validation Errors'
      })
    ],
    width: 12,
    height: 6
  });

  // Data completeness and freshness widget
  const dataMetricsWidget = new GraphWidget({
    title: 'Data Completeness & Freshness',
    left: [
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'DataCompleteness',
        dimensionsMap: {
          FunctionName: props.lambdaFunction.functionName
        },
        statistic: 'Average',
        label: 'Data Completeness (%)'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'DataFreshness',
        dimensionsMap: {
          FunctionName: props.lambdaFunction.functionName
        },
        statistic: 'Maximum',
        label: 'Data Age (hours)'
      })
    ],
    width: 12,
    height: 6
  });

  // Add all widgets to the dashboard
  dashboard.addWidgets(
    performanceWidget,
    resourceWidget,
    errorWidget,
    apiWidget,
    dataQualityWidget,
    dataMetricsWidget
  );

  return dashboard;
}

export function createValidationDashboard(scope: Construct, props: UNFetcherDashboardProps) {
  const dashboard = new Dashboard(scope, 'UNFetcherValidationDashboard', {
    dashboardName: 'UN-Fetcher-Validation-Metrics',
    periodOverride: PeriodOverride.AUTO
  });

  // Add title widget
  dashboard.addWidgets(
    new TextWidget({
      markdown: '# UN Data Fetcher Validation Metrics',
      width: 24,
      height: 1
    })
  );

  // Validation Overview Widget
  dashboard.addWidgets(new GraphWidget({
    title: 'Validation Overview',
    left: [
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'ValidationErrors',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Sum',
        period: Duration.minutes(5),
        label: 'Validation Errors'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'ValidationWarnings',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Sum',
        period: Duration.minutes(5),
        label: 'Validation Warnings'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'DataQuality',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Average',
        period: Duration.minutes(5),
        label: 'Data Quality Score'
      })
    ],
    width: 24,
    height: 6
  }));

  // Data Distribution Widget
  dashboard.addWidgets(new GraphWidget({
    title: 'Data Distribution',
    left: [
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'DataOutliers',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Sum',
        period: Duration.minutes(5),
        label: 'Data Outliers'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'DataSkewness',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Average',
        period: Duration.minutes(5),
        label: 'Data Skewness'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'DataKurtosis',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Average',
        period: Duration.minutes(5),
        label: 'Data Kurtosis'
      })
    ],
    width: 12,
    height: 6
  }));

  // Field Validation Widget
  dashboard.addWidgets(new GraphWidget({
    title: 'Field Validation',
    left: [
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'MissingFields',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Sum',
        period: Duration.minutes(5),
        label: 'Missing Fields'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'InvalidFields',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Sum',
        period: Duration.minutes(5),
        label: 'Invalid Fields'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'FieldCompleteness',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Average',
        period: Duration.minutes(5),
        label: 'Field Completeness (%)'
      })
    ],
    width: 12,
    height: 6
  }));

  // Trend Analysis Widget
  dashboard.addWidgets(new GraphWidget({
    title: 'Trend Analysis',
    left: [
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'TrendDeviation',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Average',
        period: Duration.minutes(5),
        label: 'Trend Deviation'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'SeasonalityScore',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Average',
        period: Duration.minutes(5),
        label: 'Seasonality Score'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'VolatilityIndex',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Average',
        period: Duration.minutes(5),
        label: 'Volatility Index'
      })
    ],
    width: 12,
    height: 6
  }));

  // Data Freshness Widget
  dashboard.addWidgets(new GraphWidget({
    title: 'Data Freshness',
    left: [
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'DataAge',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Maximum',
        period: Duration.minutes(5),
        label: 'Data Age (days)'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'UpdateFrequency',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Average',
        period: Duration.minutes(5),
        label: 'Update Frequency (hours)'
      })
    ],
    width: 12,
    height: 6
  }));

  // Data Completeness Widget
  dashboard.addWidgets(new GraphWidget({
    title: 'Data Completeness',
    left: [
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'DataCompleteness',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Average',
        period: Duration.minutes(5),
        label: 'Data Completeness (%)'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'CoverageScore',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Average',
        period: Duration.minutes(5),
        label: 'Coverage Score'
      })
    ],
    width: 12,
    height: 6
  }));

  // Validation Error Types Widget
  dashboard.addWidgets(new GraphWidget({
    title: 'Validation Error Types',
    left: [
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'RequiredFieldErrors',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Sum',
        period: Duration.minutes(5),
        label: 'Required Field Errors'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'NumericRangeErrors',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Sum',
        period: Duration.minutes(5),
        label: 'Numeric Range Errors'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'StringPatternErrors',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Sum',
        period: Duration.minutes(5),
        label: 'String Pattern Errors'
      })
    ],
    width: 24,
    height: 6
  }));

  // Data Consistency Widget
  dashboard.addWidgets(new GraphWidget({
    title: 'Data Consistency',
    left: [
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'DataConsistency',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Average',
        period: Duration.minutes(5),
        label: 'Data Consistency Score'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'CrossFieldValidation',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Average',
        period: Duration.minutes(5),
        label: 'Cross-Field Validation Score'
      })
    ],
    width: 12,
    height: 6
  }));

  // Custom Validation Results Widget
  dashboard.addWidgets(new GraphWidget({
    title: 'Custom Validation Results',
    left: [
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'CustomValidationErrors',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Sum',
        period: Duration.minutes(5),
        label: 'Custom Validation Errors'
      }),
      new Metric({
        namespace: 'Custom/UNFetcher',
        metricName: 'CustomValidationWarnings',
        dimensionsMap: { FunctionName: props.lambdaFunction.functionName },
        statistic: 'Sum',
        period: Duration.minutes(5),
        label: 'Custom Validation Warnings'
      })
    ],
    width: 12,
    height: 6
  }));

  return dashboard;
} 