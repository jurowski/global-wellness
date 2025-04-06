# API Documentation

## Wellness Data API

### Get Wellness Data
Retrieves wellness metrics for specified countries.

```http
GET /api/wellness-data
```

#### Query Parameters
| Parameter  | Type     | Description                                      |
|------------|----------|--------------------------------------------------|
| countries  | string   | Comma-separated list of country codes            |
| metrics    | string   | Comma-separated list of metric IDs               |
| year       | number   | (Optional) Year for historical data              |

#### Example Request
```http
GET /api/wellness-data?countries=USA,FIN&metrics=happiness,healthcare&year=2023
```

#### Example Response
```json
[
  {
    "country": "USA",
    "metrics": {
      "happiness": 75,
      "healthcare": 82
    },
    "year": 2023
  },
  {
    "country": "FIN",
    "metrics": {
      "happiness": 92,
      "healthcare": 90
    },
    "year": 2023
  }
]
```

### Available Metrics
| Metric ID    | Description                | Source                        | Update Frequency |
|--------------|----------------------------|-------------------------------|------------------|
| happiness    | Happiness Index           | World Happiness Report        | Annual          |
| healthcare   | Healthcare Quality        | WHO Global Health Observatory | Annual          |
| education    | Education Quality         | UNESCO Institute              | Annual          |
| work_life    | Work-Life Balance         | OECD Better Life Index       | Annual          |
| social_support| Social Support Systems    | Gallup World Poll            | Annual          |

## Donation API

### Create Subscription
Creates a new subscription/donation payment intent.

```http
POST /api/create-subscription
```

#### Request Body
```json
{
  "amount": 2500,  // Amount in cents
  "currency": "USD"
}
```

#### Response
```json
{
  "clientSecret": "pi_xxxxx_secret_xxxxx",
  "subscriptionId": "sub_xxxxx"
}
```

### Webhook Events
The API listens for the following Stripe webhook events:
- `payment_intent.succeeded`
- `payment_intent.failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}  // Optional additional error details
  }
}
```

### Common Error Codes
| Code              | Description                               | HTTP Status |
|-------------------|-------------------------------------------|-------------|
| INVALID_PARAMS    | Invalid request parameters                | 400         |
| NOT_FOUND         | Requested resource not found              | 404         |
| RATE_LIMIT        | Rate limit exceeded                       | 429         |
| SERVER_ERROR      | Internal server error                     | 500         |

## Rate Limiting
- 100 requests per minute per IP address
- Rate limit headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Data Quality Indicators

### Reliability Score
Each metric includes a reliability score (0-1):
```json
{
  "value": 75,
  "reliability": 0.95,
  "confidenceInterval": "±2.1"
}
```

### Historical Data
Historical data is available from 2010 onwards:
```http
GET /api/wellness-data?countries=USA&metrics=happiness&year=2010
```

## Development Guidelines

### Testing the API
1. Use the provided test environment
2. Test with sample data sets
3. Verify error handling
4. Check rate limiting behavior

### Security Considerations
- API keys must be kept secure
- Use environment variables
- Implement proper CORS policies
- Validate all input data

### Performance Optimization
- Responses are cached for 1 hour
- Use compression for large responses
- Implement database indexing
- Monitor response times

## Changelog

### v1.0.0 (2024-04-06)
- Initial API release
- Basic wellness metrics
- Stripe integration
- Rate limiting implementation

### v0.9.0 (2024-03-15)
- Beta release
- API documentation
- Test environment setup 