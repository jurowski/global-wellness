import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class IMFDataFetcher {
  private static instance: IMFDataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'gdp_growth': 'WEO',
    'inflation_rate': 'WEO',
    'unemployment_rate': 'WEO',
    'current_account_balance': 'WEO',
    'government_debt': 'WEO',
    'government_revenue': 'WEO',
    'government_expenditure': 'WEO',
    'gross_national_savings': 'WEO',
    'investment': 'WEO',
    'exports': 'WEO',
    'imports': 'WEO',
    'foreign_direct_investment': 'WEO',
    'reserves': 'WEO',
    'exchange_rate': 'WEO',
    'interest_rate': 'WEO',
    'financial_stability_index': 'FSI',
    'banking_sector_health': 'FSI',
    'market_liquidity': 'FSI',
    'credit_growth': 'FSI',
    'household_debt': 'FSI',
    'corporate_debt': 'FSI',
    'financial_market_development': 'FSI',
    'financial_inclusion': 'FSI',
    'financial_regulation': 'FSI',
    'financial_innovation': 'FSI'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): IMFDataFetcher {
    if (!IMFDataFetcher.instance) {
      IMFDataFetcher.instance = new IMFDataFetcher();
    }
    return IMFDataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    // TODO: Implement actual IMF API call
    // For now, return mock data based on World Economic Outlook and Financial Stability indicators
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('IMF', year, 0),
          unit: this.getUnitForMetric(metric)
        };
      });
    });

    return mockData;
  }

  private generateMockValue(metric: string): number {
    const ranges: Record<string, [number, number]> = {
      'gdp_growth': [-10, 10],
      'inflation_rate': [-5, 50],
      'unemployment_rate': [2, 30],
      'current_account_balance': [-20, 20],
      'government_debt': [20, 200],
      'government_revenue': [15, 50],
      'government_expenditure': [15, 50],
      'gross_national_savings': [10, 50],
      'investment': [10, 40],
      'exports': [10, 100],
      'imports': [10, 100],
      'foreign_direct_investment': [-10, 10],
      'reserves': [0, 100],
      'exchange_rate': [0.5, 2.0],
      'interest_rate': [-2, 20],
      'financial_stability_index': [0, 100],
      'banking_sector_health': [0, 100],
      'market_liquidity': [0, 100],
      'credit_growth': [-20, 30],
      'household_debt': [0, 200],
      'corporate_debt': [0, 200],
      'financial_market_development': [0, 100],
      'financial_inclusion': [0, 100],
      'financial_regulation': [0, 100],
      'financial_innovation': [0, 100]
    };

    const [min, max] = ranges[metric] || [0, 100];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    const units: Record<string, string> = {
      'gdp_growth': 'percentage',
      'inflation_rate': 'percentage',
      'unemployment_rate': 'percentage',
      'current_account_balance': 'percentage of GDP',
      'government_debt': 'percentage of GDP',
      'government_revenue': 'percentage of GDP',
      'government_expenditure': 'percentage of GDP',
      'gross_national_savings': 'percentage of GDP',
      'investment': 'percentage of GDP',
      'exports': 'percentage of GDP',
      'imports': 'percentage of GDP',
      'foreign_direct_investment': 'percentage of GDP',
      'reserves': 'months of imports',
      'exchange_rate': 'local currency per USD',
      'interest_rate': 'percentage',
      'financial_stability_index': 'index',
      'banking_sector_health': 'index',
      'market_liquidity': 'index',
      'credit_growth': 'percentage',
      'household_debt': 'percentage of GDP',
      'corporate_debt': 'percentage of GDP',
      'financial_market_development': 'index',
      'financial_inclusion': 'index',
      'financial_regulation': 'index',
      'financial_innovation': 'index'
    };

    return units[metric] || 'percentage';
  }

  public async getAvailableYears(): Promise<number[]> {
    // TODO: Implement actual year fetching from IMF API
    return [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  }

  public async getAvailableCountries(): Promise<string[]> {
    // TODO: Implement actual country list fetching from IMF API
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