import { Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { Duration } from 'aws-cdk-lib';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DataValidationRules {
  requiredFields: string[];
  numericRanges: {
    [key: string]: {
      min?: number;
      max?: number;
    };
  };
  stringPatterns: {
    [key: string]: RegExp;
  };
  customValidators: ((data: any) => ValidationResult)[];
}

export const UN_DATA_VALIDATION_RULES: DataValidationRules = {
  requiredFields: [
    'country',
    'year',
    'value',
    'source',
    'lastUpdated'
  ],
  numericRanges: {
    'value': {
      min: 0,
      max: 100
    },
    'year': {
      min: 2000,
      max: new Date().getFullYear()
    }
  },
  stringPatterns: {
    'country': /^[A-Za-z\s]+$/,
    'source': /^UN\s[A-Za-z\s]+$/
  },
  customValidators: [
    // Validate data freshness
    (data: any) => {
      const result: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: []
      };

      const lastUpdated = new Date(data.lastUpdated);
      const now = new Date();
      const daysOld = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

      if (daysOld > 365) {
        result.isValid = false;
        result.errors.push(`Data is more than 1 year old (${Math.round(daysOld)} days)`);
      } else if (daysOld > 180) {
        result.warnings.push(`Data is more than 6 months old (${Math.round(daysOld)} days)`);
      }

      return result;
    },
    // Validate data consistency
    (data: any) => {
      const result: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: []
      };

      // Check for significant changes from previous value
      if (data.previousValue) {
        const change = Math.abs(data.value - data.previousValue);
        const changePercentage = (change / data.previousValue) * 100;

        if (changePercentage > 50) {
          result.warnings.push(`Significant change detected (${changePercentage.toFixed(2)}%)`);
        }
      }

      return result;
    },
    // Validate data completeness
    (data: any) => {
      const result: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: []
      };

      const requiredFields = ['country', 'year', 'value', 'source', 'lastUpdated'];
      const missingFields = requiredFields.filter(field => !data[field]);

      if (missingFields.length > 0) {
        result.isValid = false;
        result.errors.push(`Missing required fields: ${missingFields.join(', ')}`);
      }

      return result;
    }
  ]
};

export function validateData(data: any, rules: DataValidationRules): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Validate required fields
  for (const field of rules.requiredFields) {
    if (!data[field]) {
      result.isValid = false;
      result.errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate numeric ranges
  for (const [field, range] of Object.entries(rules.numericRanges)) {
    if (data[field] !== undefined) {
      const value = Number(data[field]);
      if (isNaN(value)) {
        result.isValid = false;
        result.errors.push(`Invalid numeric value for ${field}`);
      } else {
        if (range.min !== undefined && value < range.min) {
          result.isValid = false;
          result.errors.push(`${field} value (${value}) is below minimum (${range.min})`);
        }
        if (range.max !== undefined && value > range.max) {
          result.isValid = false;
          result.errors.push(`${field} value (${value}) is above maximum (${range.max})`);
        }
      }
    }
  }

  // Validate string patterns
  for (const [field, pattern] of Object.entries(rules.stringPatterns)) {
    if (data[field] && !pattern.test(data[field])) {
      result.isValid = false;
      result.errors.push(`Invalid format for ${field}`);
    }
  }

  // Run custom validators
  for (const validator of rules.customValidators) {
    const validationResult = validator(data);
    result.isValid = result.isValid && validationResult.isValid;
    result.errors.push(...validationResult.errors);
    result.warnings.push(...validationResult.warnings);
  }

  return result;
}

export function emitValidationMetrics(
  validationResult: ValidationResult,
  metricNamespace: string,
  functionName: string
): Metric[] {
  const metrics: Metric[] = [];

  // Emit validation error count
  metrics.push(new Metric({
    namespace: metricNamespace,
    metricName: 'ValidationErrors',
    dimensionsMap: {
      FunctionName: functionName
    },
    statistic: 'Sum',
    period: Duration.minutes(5)
  }));

  // Emit validation warning count
  metrics.push(new Metric({
    namespace: metricNamespace,
    metricName: 'ValidationWarnings',
    dimensionsMap: {
      FunctionName: functionName
    },
    statistic: 'Sum',
    period: Duration.minutes(5)
  }));

  // Emit data quality score (0-100)
  const qualityScore = validationResult.errors.length === 0 ? 100 : 0;
  metrics.push(new Metric({
    namespace: metricNamespace,
    metricName: 'DataQuality',
    dimensionsMap: {
      FunctionName: functionName
    },
    statistic: 'Average',
    period: Duration.minutes(5)
  }));

  return metrics;
} 