# Global Wellness Developer Documentation

## Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [API Documentation](#api-documentation)
- [Component Library](#component-library)
- [Data Management](#data-management)
- [Styling Guide](#styling-guide)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/global-wellness.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## Project Structure
```
global-wellness/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── donors/            # Donors page
│   ├── methodology/       # Methodology page
│   └── about/            # About page
├── components/            # Reusable React components
├── docs/                 # Developer documentation
├── public/               # Static assets
├── styles/               # Global styles
└── types/               # TypeScript type definitions
```

## Environment Setup

### Required Environment Variables
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Development Environment
The application uses Next.js 14 with the following key configurations:
- Tailwind CSS for styling
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting

## API Documentation

### Wellness Data Endpoint
- **Endpoint**: `/api/wellness-data`
- **Method**: GET
- **Query Parameters**:
  - `countries`: Comma-separated list of country codes
  - `metrics`: Comma-separated list of metric IDs
  - `year`: Optional year for historical data
- **Response Format**:
```typescript
interface WellnessResponse {
  country: string;
  metrics: {
    [key: string]: number;
  };
  year: number;
}
```

### Stripe Integration
- **Endpoint**: `/api/create-subscription`
- **Method**: POST
- **Body**:
```typescript
interface SubscriptionRequest {
  amount: number;
  currency: string;
}
```

## Component Library

### Core Components
1. **CountrySelector**
   - Props: `selectedCountries`, `setSelectedCountries`
   - Purpose: Manages country selection with search and multi-select

2. **MetricSelector**
   - Props: `metrics`, `selectedMetrics`, `setSelectedMetrics`
   - Purpose: Handles metric selection with data quality indicators

3. **WellnessInsights**
   - Props: `data`, `metrics`
   - Purpose: Visualizes wellness data using Recharts

### Data Quality Components
- Reliability indicators
- Confidence intervals
- Sample size displays
- Update frequency badges

## Data Management

### Data Sources
- World Happiness Report
- WHO Global Health Observatory
- UNESCO Institute for Statistics
- OECD Better Life Index
- Gallup World Poll

### Data Processing
1. Normalization techniques
2. Quality assessment methods
3. Historical data generation
4. Confidence interval calculations

## Styling Guide

### Theme Configuration
The application uses a dark theme with CSS variables:
```css
--background-dark: #111827
--background-light: #1f2937
--card-bg: #1f2937
--border-color: #374151
--text-primary: #f3f4f6
--text-secondary: #9ca3af
--accent-primary: #3b82f6
--accent-secondary: #60a5fa
```

### Tailwind CSS Configuration
Custom configuration in `tailwind.config.js` includes:
- Extended color palette
- Custom component classes
- Responsive design utilities

## Testing
- Unit tests: Jest and React Testing Library
- Integration tests: Cypress
- API tests: Supertest
- Performance testing: Lighthouse

## Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Configure environment variables
3. Set up custom domain
4. Enable automatic deployments

### Production Considerations
- Environment variable management
- API rate limiting
- Error monitoring
- Analytics integration

## Troubleshooting

### Common Issues
1. **Port Conflicts**
   - Default port 3000 may be in use
   - Application will automatically try ports 3001, 3002, etc.
   - Check running processes with `lsof -i :3000`

2. **API Errors**
   - Verify environment variables
   - Check API rate limits
   - Validate request parameters

3. **Styling Issues**
   - Clear browser cache
   - Rebuild Tailwind CSS
   - Check CSS variable scope

### Development Tips
- Use React Developer Tools
- Enable debug logging
- Monitor network requests
- Check build output

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 