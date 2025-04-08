import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type WellnessMetric {
    value: Float!
    year: Int!
    source: String!
    confidenceInterval: String!
    isRealData: Boolean!
    category: String!
  }

  type Country {
    name: String
    countryCode: String!
    region: String!
    population: Int!
    happiness: WellnessMetric
    healthcare: WellnessMetric
    education: WellnessMetric
    work_life: WellnessMetric
    social_support: WellnessMetric
  }

  type MetricAvailability {
    metric: String!
    isAvailable: Boolean!
    source: String!
    lastUpdated: String
  }

  type Query {
    countries: [Country!]!
    metrics: [String!]!
    wellnessData(countries: [String!], metrics: [String!]): [Country!]!
    compareCountries(countryCodes: [String!]!): [Country!]!
    getTrends(country: String!, metric: String!, years: Int!): [WellnessMetric!]!
    getRegionalAverages(metric: String!): [RegionalAverage!]!
    searchCountries(query: String!): [Country!]!
    availableMetrics(countries: [String!]!): [MetricAvailability!]!
  }

  type RegionalAverage {
    region: String!
    value: Float!
    year: Int!
    source: String!
    confidenceInterval: String!
    isRealData: Boolean!
  }

  type Mutation {
    updateMetric(
      country: String!
      metric: String!
      value: Float!
      year: Int!
      source: String!
      confidenceInterval: String!
    ): WellnessMetric!
    addCountry(
      name: String!
      code: String!
      region: String!
      population: Int!
    ): Country!
  }
`; 