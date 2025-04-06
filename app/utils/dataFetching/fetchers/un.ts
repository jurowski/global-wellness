import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class UNDataFetcher {
  private static instance: UNDataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'human_development_index': 'HDI',
    'life_expectancy_at_birth': 'HDI',
    'expected_years_of_schooling': 'HDI',
    'mean_years_of_schooling': 'HDI',
    'gni_per_capita': 'HDI',
    'gender_inequality_index': 'GII',
    'maternal_mortality_ratio': 'GII',
    'adolescent_birth_rate': 'GII',
    'female_parliamentary_representation': 'GII',
    'female_labor_force_participation': 'GII',
    'sustainable_development_goal_index': 'SDG',
    'poverty_index': 'SDG',
    'hunger_index': 'SDG',
    'health_index': 'SDG',
    'education_index': 'SDG',
    'gender_equality_index': 'SDG',
    'clean_water_index': 'SDG',
    'clean_energy_index': 'SDG',
    'decent_work_index': 'SDG',
    'reduced_inequalities_index': 'SDG',
    'sustainable_cities_index': 'SDG',
    'climate_action_index': 'SDG',
    'peace_index': 'SDG',
    'justice_index': 'SDG'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): UNDataFetcher {
    if (!UNDataFetcher.instance) {
      UNDataFetcher.instance = new UNDataFetcher();
    }
    return UNDataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    // TODO: Implement actual UN API call
    // For now, return mock data based on Human Development Index and SDG indicators
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('UN', year, 0),
          unit: this.getUnitForMetric(metric)
        };
      });
    });

    return mockData;
  }

  private generateMockValue(metric: string): number {
    const ranges: Record<string, [number, number]> = {
      'human_development_index': [0.3, 1.0],
      'life_expectancy_at_birth': [50, 85],
      'expected_years_of_schooling': [5, 18],
      'mean_years_of_schooling': [2, 13],
      'gni_per_capita': [500, 80000],
      'gender_inequality_index': [0.1, 0.8],
      'maternal_mortality_ratio': [2, 1000],
      'adolescent_birth_rate': [1, 200],
      'female_parliamentary_representation': [0, 100],
      'female_labor_force_participation': [20, 100],
      'sustainable_development_goal_index': [30, 100],
      'poverty_index': [0, 100],
      'hunger_index': [0, 100],
      'health_index': [0, 100],
      'education_index': [0, 100],
      'gender_equality_index': [0, 100],
      'clean_water_index': [0, 100],
      'clean_energy_index': [0, 100],
      'decent_work_index': [0, 100],
      'reduced_inequalities_index': [0, 100],
      'sustainable_cities_index': [0, 100],
      'climate_action_index': [0, 100],
      'peace_index': [0, 100],
      'justice_index': [0, 100]
    };

    const [min, max] = ranges[metric] || [0, 100];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    const units: Record<string, string> = {
      'human_development_index': 'index',
      'life_expectancy_at_birth': 'years',
      'expected_years_of_schooling': 'years',
      'mean_years_of_schooling': 'years',
      'gni_per_capita': 'USD',
      'gender_inequality_index': 'index',
      'maternal_mortality_ratio': 'per 100,000 live births',
      'adolescent_birth_rate': 'per 1,000 women aged 15-19',
      'female_parliamentary_representation': 'percentage',
      'female_labor_force_participation': 'percentage',
      'sustainable_development_goal_index': 'index',
      'poverty_index': 'index',
      'hunger_index': 'index',
      'health_index': 'index',
      'education_index': 'index',
      'gender_equality_index': 'index',
      'clean_water_index': 'index',
      'clean_energy_index': 'index',
      'decent_work_index': 'index',
      'reduced_inequalities_index': 'index',
      'sustainable_cities_index': 'index',
      'climate_action_index': 'index',
      'peace_index': 'index',
      'justice_index': 'index'
    };

    return units[metric] || 'index';
  }

  public async getAvailableYears(): Promise<number[]> {
    // TODO: Implement actual year fetching from UN API
    return [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  }

  public async getAvailableCountries(): Promise<string[]> {
    // TODO: Implement actual country list fetching from UN API
    return [
      'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
      'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas',
      'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize',
      'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
      'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde',
      'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile',
      'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba',
      'Cyprus', 'Czech Republic', "Côte d'Ivoire", 'Democratic Republic of the Congo',
      'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
      'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
      'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana',
      'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
      'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
      'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
      'Kuwait', 'Kyrgyzstan', "Lao People's Democratic Republic", 'Latvia', 'Lebanon',
      'Lesotho', 'Liberia', 'Libya', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
      'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
      'Mauritius', 'Mexico', 'Micronesia', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
      'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
      'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
      'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
      'Poland', 'Portugal', 'Qatar', 'Republic of Korea', 'Republic of Moldova', 'Romania',
      'Russian Federation', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
      'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
      'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
      'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan',
      'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syrian Arab Republic',
      'Tajikistan', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
      'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
      'United Kingdom', 'United Republic of Tanzania', 'United States', 'Uruguay', 'Uzbekistan',
      'Vanuatu', 'Venezuela', 'Viet Nam', 'Yemen', 'Zambia', 'Zimbabwe'
    ];
  }

  public async getAvailableMetrics(): Promise<string[]> {
    return Object.keys(this.metrics);
  }
} 