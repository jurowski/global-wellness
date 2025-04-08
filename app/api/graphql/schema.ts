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

  type StateMetric {
    value: Float!
    year: Int!
    source: String!
    confidenceInterval: String
    isRealData: Boolean!
    category: String!
  }

  type State {
    name: String!
    stateCode: String!
    region: String!
    population: Int!
    happiness: StateMetric
    healthcare: StateMetric
    education: StateMetric
    work_life: StateMetric
    social_support: StateMetric
  }

  type Query {
    countries: [Country!]!
    country(countryCode: String!): Country
    metrics: [String!]!
    wellnessData(countries: [String!], metrics: [String!]): [Country!]!
    compareCountries(countryCodes: [String!]!): [Country!]!
    getTrends(country: String!, metric: String!, years: Int!): [WellnessMetric!]!
    getRegionalAverages(metric: String!): [RegionalAverage!]!
    searchCountries(query: String!): [Country!]!
    availableMetrics(countries: [String!]!): [MetricAvailability!]!
    states: [State!]!
    state(stateCode: String!): State
    compareStates(stateCodes: [String!]!): [State!]!
    availableStateMetrics(states: [String!]!): [MetricAvailability!]!
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