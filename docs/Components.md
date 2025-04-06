# Component Documentation

## Core Components

### CountrySelector
A searchable multi-select component for choosing countries to analyze.

```typescript
interface CountrySelectorProps {
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
}
```

#### Features
- Searchable dropdown
- Multi-select capability
- Country flag icons
- Keyboard navigation
- Clear selection button

#### Example Usage
```tsx
<CountrySelector
  selectedCountries={['USA', 'FIN']}
  setSelectedCountries={handleCountryChange}
/>
```

### MetricSelector
Component for selecting wellness metrics with data quality indicators.

```typescript
interface MetricSelectorProps {
  metrics: WellnessMetric[];
  selectedMetrics: string[];
  setSelectedMetrics: (metrics: string[]) => void;
}

interface WellnessMetric {
  id: string;
  name: string;
  description: string;
  source: string;
  citation: string;
  sourceLink: string;
  dataQuality: {
    reliability: number;
    sampleSize: string;
    updateFrequency: string;
    confidenceInterval: string;
    methodology: string;
  };
}
```

#### Features
- Metric cards with descriptions
- Data quality indicators
- Source citations
- Methodology information
- Interactive selection

#### Example Usage
```tsx
<MetricSelector
  metrics={WELLNESS_METRICS}
  selectedMetrics={['happiness', 'healthcare']}
  setSelectedMetrics={handleMetricChange}
/>
```

### WellnessInsights
Data visualization component using Recharts library.

```typescript
interface WellnessInsightsProps {
  data: WellnessData[];
  metrics: WellnessMetric[];
}

interface WellnessData {
  country: string;
  metrics: Record<string, number>;
  year: number;
}
```

#### Features
- Line charts for trends
- Bar charts for comparisons
- Interactive tooltips
- Responsive design
- Custom color schemes
- Legend customization

#### Example Usage
```tsx
<WellnessInsights
  data={wellnessData}
  metrics={WELLNESS_METRICS}
/>
```

### CheckoutForm
Stripe payment form component for donations.

```typescript
interface CheckoutFormProps {
  donationAmount: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
```

#### Features
- Secure payment processing
- Custom donation amounts
- Error handling
- Loading states
- Success confirmation

#### Example Usage
```tsx
<CheckoutForm
  donationAmount={2500}
  onSuccess={handleSuccess}
  onError={handleError}
/>
```

## Layout Components

### Header
Main navigation and branding component.

```typescript
interface HeaderProps {
  showDonateButton?: boolean;
  transparent?: boolean;
}
```

#### Features
- Responsive navigation
- Dark theme support
- Mobile menu
- Donation button
- Active route highlighting

### Footer
Site footer with data sources and information.

```typescript
interface FooterProps {
  showDataSources?: boolean;
  showSocialLinks?: boolean;
}
```

#### Features
- Data source citations
- Social media links
- Newsletter signup
- Copyright information
- Responsive layout

## Data Quality Components

### ReliabilityIndicator
Visual indicator for data reliability scores.

```typescript
interface ReliabilityIndicatorProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

#### Features
- Color-coded indicators
- Tooltip explanations
- Customizable size
- Accessibility support

### ConfidenceInterval
Displays statistical confidence intervals.

```typescript
interface ConfidenceIntervalProps {
  value: string;
  showExplanation?: boolean;
}
```

#### Features
- Visual representation
- Tooltip explanations
- Mathematical notation
- Accessibility support

## Utility Components

### LoadingSpinner
Animated loading indicator.

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  message?: string;
}
```

### ErrorBoundary
Error handling component wrapper.

```typescript
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  onError?: (error: Error) => void;
}
```

## Component Best Practices

### Performance
1. Use React.memo for pure components
2. Implement proper dependency arrays in hooks
3. Lazy load components when appropriate
4. Optimize re-renders

### Accessibility
1. Use semantic HTML
2. Include ARIA labels
3. Support keyboard navigation
4. Maintain color contrast
5. Provide text alternatives

### Testing
1. Write unit tests for components
2. Test edge cases
3. Mock external dependencies
4. Test accessibility
5. Test responsive behavior

### Styling
1. Follow Tailwind CSS conventions
2. Use CSS variables for theming
3. Maintain responsive design
4. Follow dark theme guidelines

## Component Development

### Adding New Components
1. Create component file
2. Write TypeScript interfaces
3. Implement component logic
4. Add styles
5. Write tests
6. Document usage

### Modifying Components
1. Maintain backward compatibility
2. Update documentation
3. Update tests
4. Test all use cases
5. Update example usage

## Future Improvements

### Planned Components
1. Data Export
2. Advanced Filters
3. Custom Visualizations
4. Interactive Maps
5. Comparison Tools

### Enhancement Ideas
1. Animation improvements
2. Performance optimizations
3. Additional chart types
4. Enhanced accessibility
5. More customization options 