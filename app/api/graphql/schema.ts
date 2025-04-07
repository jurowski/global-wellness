import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Metric {
    value: Float!
    year: Int!
    source: String!
    confidenceInterval: String!
    isRealData: Boolean!
    category: String!
  }

  type Country {
    name: String!
    code: String!
    region: String!
    population: Int!
    happiness: Metric
    healthcare: Metric
    education: Metric
    work_life: Metric
    social_support: Metric
  }

  type ComparisonResult {
    metric: String!
    country1Value: Float!
    country2Value: Float!
    difference: Float!
    percentageDifference: Float!
    isSignificant: Boolean!
  }

  type TrendData {
    year: Int!
    value: Float!
  }

  type RegionalAverage {
    region: String!
    average: Float!
    sampleSize: Int!
  }

  type Query {
    countries: [String!]!
    metrics: [String!]!
    wellnessData(countries: [String!], metrics: [String!]): [Country!]!
    compareCountries(country1: String!, country2: String!, metrics: [String!]!): [ComparisonResult!]!
    getTrends(country: String!, metric: String!, years: Int!): [TrendData!]!
    getRegionalAverages(metric: String!): [RegionalAverage!]!
    searchCountries(query: String!): [Country!]!
  }

  type Mutation {
    updateMetric(
      country: String!
      metric: String!
      value: Float!
      year: Int!
      source: String!
      confidenceInterval: String!
    ): Metric!
    addCountry(
      name: String!
      code: String!
      region: String!
      population: Int!
    ): Country!
  }
`; 