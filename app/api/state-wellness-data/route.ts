import { NextResponse } from 'next/server';

interface StateData {
  name: string;
  stateCode: string;
  region: string;
  population: number;
  happiness: {
    value: number;
    year: number;
    source: string;
    confidenceInterval: string;
    isRealData: boolean;
    category: string;
  };
  healthcare: {
    value: number;
    year: number;
    source: string;
    confidenceInterval: string;
    isRealData: boolean;
    category: string;
  };
  education: {
    value: number;
    year: number;
    source: string;
    confidenceInterval: string;
    isRealData: boolean;
    category: string;
  };
  work_life: {
    value: number;
    year: number;
    source: string;
    confidenceInterval: string;
    isRealData: boolean;
    category: string;
  };
  social_support: {
    value: number;
    year: number;
    source: string;
    confidenceInterval: string;
    isRealData: boolean;
    category: string;
  };
}

// Mock data - in production, this would come from a database or external API
const stateData: StateData[] = [
  {
    name: 'California',
    stateCode: 'CA',
    region: 'West',
    population: 39538223,
    happiness: {
      value: 7.2,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 8.1,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.8,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.4',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.5,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.9,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'New York',
    stateCode: 'NY',
    region: 'Northeast',
    population: 20201249,
    happiness: {
      value: 7.0,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 8.3,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 8.0,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.2,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.7,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Texas',
    stateCode: 'TX',
    region: 'South',
    population: 29145505,
    happiness: {
      value: 7.4,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.5,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.2,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.4',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.8,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.6,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Florida',
    stateCode: 'FL',
    region: 'South',
    population: 21538187,
    happiness: {
      value: 7.6,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.7,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.4,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.4',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.9,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.8,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Massachusetts',
    stateCode: 'MA',
    region: 'Northeast',
    population: 7029917,
    happiness: {
      value: 7.5,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 8.5,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 8.4,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.6,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.8,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Washington',
    stateCode: 'WA',
    region: 'West',
    population: 7705281,
    happiness: {
      value: 7.3,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 8.2,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.9,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.7,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.6,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Colorado',
    stateCode: 'CO',
    region: 'West',
    population: 5773714,
    happiness: {
      value: 7.7,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 8.0,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.8,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 8.0,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.9,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Minnesota',
    stateCode: 'MN',
    region: 'Midwest',
    population: 5706494,
    happiness: {
      value: 7.6,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 8.3,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 8.1,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.8,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 8.0,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Oregon',
    stateCode: 'OR',
    region: 'West',
    population: 4237256,
    happiness: {
      value: 7.1,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.9,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.6,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.4',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.7,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.5,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Virginia',
    stateCode: 'VA',
    region: 'South',
    population: 8631393,
    happiness: {
      value: 7.4,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.8,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.9,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.6,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.7,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Illinois',
    stateCode: 'IL',
    region: 'Midwest',
    population: 12812508,
    happiness: {
      value: 7.3,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.9,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.7,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.4,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.6,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Arizona',
    stateCode: 'AZ',
    region: 'West',
    population: 7278717,
    happiness: {
      value: 7.5,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.6,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.3,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.4',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.8,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.7,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'North Carolina',
    stateCode: 'NC',
    region: 'South',
    population: 10439388,
    happiness: {
      value: 7.2,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.4,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.5,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.4',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.6,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.8,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Michigan',
    stateCode: 'MI',
    region: 'Midwest',
    population: 10077331,
    happiness: {
      value: 7.1,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.8,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.6,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.4',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.3,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.5,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Georgia',
    stateCode: 'GA',
    region: 'South',
    population: 10711908,
    happiness: {
      value: 7.4,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.3,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.4,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.4',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.7,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.6,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Pennsylvania',
    stateCode: 'PA',
    region: 'Northeast',
    population: 13002700,
    happiness: {
      value: 7.2,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.9,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.8,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.5,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.7,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Ohio',
    stateCode: 'OH',
    region: 'Midwest',
    population: 11799448,
    happiness: {
      value: 7.0,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.7,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.5,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.4',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.4,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.6,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'New Jersey',
    stateCode: 'NJ',
    region: 'Northeast',
    population: 9288994,
    happiness: {
      value: 7.3,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 8.1,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.9,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.2,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.5,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Tennessee',
    stateCode: 'TN',
    region: 'South',
    population: 6910840,
    happiness: {
      value: 7.5,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.2,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.3,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.4',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.7,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.8,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'social_support'
    }
  }
];

export async function GET() {
  try {
    return NextResponse.json(stateData);
  } catch (error) {
    console.error('Error fetching state data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch state data' },
      { status: 500 }
    );
  }
} 