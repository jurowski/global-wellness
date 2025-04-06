# Global Wellness Perspectives - Linked List of Code Files

## Core Application Files

1. **Main Application Page**
   - [pages/index.js](artifact:updated-main-page) - The main entry point and layout for the application

2. **API Endpoint**
   - [pages/api/wellness-data.js](artifact:api-wellness-data) - Enhanced API endpoint for multi-source data

## Data Fetching System

3. **Data Fetching Controller**
   - [utils/dataFetching/index.js](artifact:comprehensive-data-fetching) - Main controller for fetching data from multiple sources

4. **Individual Data Fetchers**
   - [utils/dataFetching/worldHappinessData.js](artifact:world-happiness-data) - World Happiness Report data fetcher
   - [utils/dataFetching/oecdData.js](artifact:oecd-data) - OECD Better Life Index data fetcher
   - [utils/dataFetching/whoData.js](artifact:who-data) - WHO Data Repository fetcher
   - [utils/dataFetching/unData.js](artifact:un-data) - UN Human Development Index data fetcher
   - [utils/dataFetching/worldBankData.js](artifact:world-bank-data) - World Bank data fetcher

5. **Data Processing Utilities**
   - [utils/dataFetching/dataMerger.js](artifact:data-merger) - Utility to merge data from multiple sources
   - [utils/dataFetching/dataSourceMarker.js](artifact:data-source-indicator) - Utility to mark data source validity

## UI Components

6. **Data Visualization Components**
   - [components/WellnessComparison.js](artifact:wellness-comparison-update) - Interactive visualizations with data source indicators
   - [components/DataSourcesInfo.js](artifact:data-sources-info) - Component for displaying data source attribution

7. **Selector Components**
   - [components/CountrySelector.js and components/MetricSelector.js](artifact:component-selectors) - UI for selecting countries and metrics to compare

8. **Data Analysis Components**
   - [components/WellnessInsights.js](artifact:component-insights-api) - Generates insights from the comparison data

9. **Educational Components**
   - [components/SocietalStructuresContext.js](artifact:societal-structures-context) - Information about different societal models
   - [components/EducationalResources.js](artifact:educational-resources) - Curated resources for learning more
   - [components/FAQ.js](artifact:faq-component) - Frequently asked questions about the application

## Implementation Guides

10. **Setup and Implementation Guides**
    - [Enhanced Implementation Guide](artifact:enhanced-implementation-guide) - Comprehensive guide for implementing the enhanced system
    - [Quickstart Guide](artifact:quickstart-guide) - Guide for launching the application within 24 hours

11. **Promotional Materials**
    - [Promotional Video Script](artifact:enhanced-promo-video-script) - Script for creating a promotional video
    - [Avatar Speaking Script](artifact:avatar-speaking-script) - Clean script just for the avatar's dialogue

This updated file structure adds a comprehensive data integration system that pulls from multiple international sources while maintaining transparency about data origins. The core functionality remains the same, but the data backend has been significantly enhanced to support multiple data sources and clear marking of data validity.
