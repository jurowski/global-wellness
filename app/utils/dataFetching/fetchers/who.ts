import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class WHODataFetcher {
  private static instance: WHODataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'life_expectancy': 'GHO',
    'healthy_life_expectancy': 'GHO',
    'mortality_rate': 'GHO',
    'health_expenditure': 'GHO',
    'physicians_density': 'GHO',
    'hospital_beds': 'GHO',
    'immunization_coverage': 'GHO',
    'prevalence_of_obesity': 'GHO',
    'prevalence_of_depression': 'GHO',
    'suicide_rate': 'GHO',
    'alcohol_consumption': 'GHO',
    'tobacco_use': 'GHO'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): WHODataFetcher {
    if (!WHODataFetcher.instance) {
      WHODataFetcher.instance = new WHODataFetcher();
    }
    return WHODataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    // TODO: Implement actual WHO API call
    // For now, return mock data based on WHO Global Health Observatory structure
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('WHO', year, 0),
          unit: this.getUnitForMetric(metric)
        };
      });
    });

    return mockData;
  }

  private generateMockValue(metric: string): number {
    const ranges: Record<string, [number, number]> = {
      'life_expectancy': [50, 85],
      'healthy_life_expectancy': [45, 75],
      'mortality_rate': [2, 20],
      'health_expenditure': [100, 12000],
      'physicians_density': [0.1, 8],
      'hospital_beds': [0.5, 15],
      'immunization_coverage': [50, 100],
      'prevalence_of_obesity': [5, 40],
      'prevalence_of_depression': [2, 10],
      'suicide_rate': [2, 30],
      'alcohol_consumption': [0, 15],
      'tobacco_use': [5, 40]
    };

    const [min, max] = ranges[metric] || [0, 100];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    const units: Record<string, string> = {
      'life_expectancy': 'years',
      'healthy_life_expectancy': 'years',
      'mortality_rate': 'per 1000',
      'health_expenditure': 'USD per capita',
      'physicians_density': 'per 1000',
      'hospital_beds': 'per 1000',
      'immunization_coverage': 'percentage',
      'prevalence_of_obesity': 'percentage',
      'prevalence_of_depression': 'percentage',
      'suicide_rate': 'per 100000',
      'alcohol_consumption': 'liters per capita',
      'tobacco_use': 'percentage'
    };

    return units[metric] || 'percentage';
  }

  public async getAvailableYears(): Promise<number[]> {
    // TODO: Implement actual year fetching from WHO API
    return [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  }

  public async getAvailableCountries(): Promise<string[]> {
    // TODO: Implement actual country list fetching from WHO API
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