import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class WorldBankDataFetcher {
  private static instance: WorldBankDataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'gdp_per_capita': 'WDI',
    'poverty_rate': 'WDI',
    'income_inequality': 'WDI',
    'unemployment_rate': 'WDI',
    'education_expenditure': 'WDI',
    'health_expenditure': 'WDI',
    'access_to_electricity': 'WDI',
    'internet_users': 'WDI',
    'urban_population': 'WDI',
    'co2_emissions': 'WDI',
    'renewable_energy': 'WDI',
    'forest_area': 'WDI'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): WorldBankDataFetcher {
    if (!WorldBankDataFetcher.instance) {
      WorldBankDataFetcher.instance = new WorldBankDataFetcher();
    }
    return WorldBankDataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    // TODO: Implement actual World Bank API call
    // For now, return mock data based on World Development Indicators
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('WorldBank', year, 0),
          unit: this.getUnitForMetric(metric)
        };
      });
    });

    return mockData;
  }

  private generateMockValue(metric: string): number {
    const ranges: Record<string, [number, number]> = {
      'gdp_per_capita': [500, 80000],
      'poverty_rate': [0, 50],
      'income_inequality': [20, 60],
      'unemployment_rate': [2, 30],
      'education_expenditure': [2, 8],
      'health_expenditure': [2, 12],
      'access_to_electricity': [50, 100],
      'internet_users': [10, 100],
      'urban_population': [20, 100],
      'co2_emissions': [0.1, 20],
      'renewable_energy': [5, 100],
      'forest_area': [5, 100]
    };

    const [min, max] = ranges[metric] || [0, 100];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    const units: Record<string, string> = {
      'gdp_per_capita': 'USD',
      'poverty_rate': 'percentage',
      'income_inequality': 'Gini index',
      'unemployment_rate': 'percentage',
      'education_expenditure': 'percentage of GDP',
      'health_expenditure': 'percentage of GDP',
      'access_to_electricity': 'percentage',
      'internet_users': 'percentage',
      'urban_population': 'percentage',
      'co2_emissions': 'metric tons per capita',
      'renewable_energy': 'percentage',
      'forest_area': 'percentage'
    };

    return units[metric] || 'percentage';
  }

  public async getAvailableYears(): Promise<number[]> {
    // TODO: Implement actual year fetching from World Bank API
    return [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  }

  public async getAvailableCountries(): Promise<string[]> {
    // TODO: Implement actual country list fetching from World Bank API
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