import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class GallupDataFetcher {
  private static instance: GallupDataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'life_evaluation': 'Global Well-Being',
    'positive_emotions': 'Global Well-Being',
    'negative_emotions': 'Global Well-Being',
    'social_support': 'Global Well-Being',
    'freedom_to_choose': 'Global Well-Being',
    'generosity': 'Global Well-Being',
    'corruption_perception': 'Global Well-Being',
    'confidence_in_government': 'Global Well-Being',
    'confidence_in_business': 'Global Well-Being',
    'confidence_in_media': 'Global Well-Being',
    'job_climate': 'Global Well-Being',
    'city_satisfaction': 'Global Well-Being',
    'food_security': 'Global Well-Being',
    'shelter_security': 'Global Well-Being',
    'healthcare_access': 'Global Well-Being',
    'education_access': 'Global Well-Being',
    'internet_access': 'Global Well-Being',
    'safety_index': 'Global Well-Being',
    'community_trust': 'Global Well-Being',
    'religious_importance': 'Global Well-Being',
    'work_engagement': 'Global Well-Being',
    'work_environment': 'Global Well-Being',
    'work_purpose': 'Global Well-Being',
    'work_development': 'Global Well-Being',
    'work_balance': 'Global Well-Being'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): GallupDataFetcher {
    if (!GallupDataFetcher.instance) {
      GallupDataFetcher.instance = new GallupDataFetcher();
    }
    return GallupDataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    // TODO: Implement actual Gallup API call
    // For now, return mock data based on Global Well-Being indicators
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('Gallup', year, 0),
          unit: this.getUnitForMetric(metric)
        };
      });
    });

    return mockData;
  }

  private generateMockValue(metric: string): number {
    const ranges: Record<string, [number, number]> = {
      'life_evaluation': [0, 10],
      'positive_emotions': [0, 100],
      'negative_emotions': [0, 100],
      'social_support': [0, 100],
      'freedom_to_choose': [0, 100],
      'generosity': [0, 100],
      'corruption_perception': [0, 100],
      'confidence_in_government': [0, 100],
      'confidence_in_business': [0, 100],
      'confidence_in_media': [0, 100],
      'job_climate': [0, 100],
      'city_satisfaction': [0, 100],
      'food_security': [0, 100],
      'shelter_security': [0, 100],
      'healthcare_access': [0, 100],
      'education_access': [0, 100],
      'internet_access': [0, 100],
      'safety_index': [0, 100],
      'community_trust': [0, 100],
      'religious_importance': [0, 100],
      'work_engagement': [0, 100],
      'work_environment': [0, 100],
      'work_purpose': [0, 100],
      'work_development': [0, 100],
      'work_balance': [0, 100]
    };

    const [min, max] = ranges[metric] || [0, 100];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    const units: Record<string, string> = {
      'life_evaluation': 'scale (0-10)',
      'positive_emotions': 'percentage',
      'negative_emotions': 'percentage',
      'social_support': 'percentage',
      'freedom_to_choose': 'percentage',
      'generosity': 'percentage',
      'corruption_perception': 'percentage',
      'confidence_in_government': 'percentage',
      'confidence_in_business': 'percentage',
      'confidence_in_media': 'percentage',
      'job_climate': 'percentage',
      'city_satisfaction': 'percentage',
      'food_security': 'percentage',
      'shelter_security': 'percentage',
      'healthcare_access': 'percentage',
      'education_access': 'percentage',
      'internet_access': 'percentage',
      'safety_index': 'percentage',
      'community_trust': 'percentage',
      'religious_importance': 'percentage',
      'work_engagement': 'percentage',
      'work_environment': 'percentage',
      'work_purpose': 'percentage',
      'work_development': 'percentage',
      'work_balance': 'percentage'
    };

    return units[metric] || 'percentage';
  }

  public async getAvailableYears(): Promise<number[]> {
    // TODO: Implement actual year fetching from Gallup API
    return [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  }

  public async getAvailableCountries(): Promise<string[]> {
    // TODO: Implement actual country list fetching from Gallup API
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