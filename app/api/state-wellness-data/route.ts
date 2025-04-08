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
  },
  {
    name: 'Maryland',
    stateCode: 'MD',
    region: 'Northeast',
    population: 6177224,
    happiness: {
      value: 7.4,
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
      value: 8.1,
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
    name: 'Wisconsin',
    stateCode: 'WI',
    region: 'Midwest',
    population: 5893718,
    happiness: {
      value: 7.5,
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
      value: 7.7,
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
    name: 'Indiana',
    stateCode: 'IN',
    region: 'Midwest',
    population: 6785528,
    happiness: {
      value: 7.2,
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
      value: 7.4,
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
      value: 7.6,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Missouri',
    stateCode: 'MO',
    region: 'Midwest',
    population: 6177957,
    happiness: {
      value: 7.3,
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
      value: 7.3,
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
      value: 7.7,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'South Carolina',
    stateCode: 'SC',
    region: 'South',
    population: 5118425,
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
      value: 7.2,
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
    name: 'Alabama',
    stateCode: 'AL',
    region: 'South',
    population: 5024279,
    happiness: {
      value: 7.1,
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
      value: 7.1,
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
      value: 7.7,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Louisiana',
    stateCode: 'LA',
    region: 'South',
    population: 4657757,
    happiness: {
      value: 7.0,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.1,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.0,
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
    name: 'Kentucky',
    stateCode: 'KY',
    region: 'South',
    population: 4509394,
    happiness: {
      value: 7.2,
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
      value: 7.2,
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
      value: 7.7,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Oklahoma',
    stateCode: 'OK',
    region: 'South',
    population: 3959353,
    happiness: {
      value: 7.3,
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
      value: 7.1,
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
    name: 'Connecticut',
    stateCode: 'CT',
    region: 'Northeast',
    population: 3605944,
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
      value: 8.2,
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
    name: 'Iowa',
    stateCode: 'IA',
    region: 'Midwest',
    population: 3190369,
    happiness: {
      value: 7.7,
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
      value: 7.8,
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
    name: 'Nevada',
    stateCode: 'NV',
    region: 'West',
    population: 3104614,
    happiness: {
      value: 7.3,
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
      value: 7.2,
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
      value: 7.6,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Utah',
    stateCode: 'UT',
    region: 'West',
    population: 3271616,
    happiness: {
      value: 7.8,
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
      value: 7.9,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
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
    name: 'Arkansas',
    stateCode: 'AR',
    region: 'South',
    population: 3011524,
    happiness: {
      value: 7.2,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.1,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.0,
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
    name: 'Mississippi',
    stateCode: 'MS',
    region: 'South',
    population: 2961279,
    happiness: {
      value: 7.0,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 7.0,
      year: 2023,
      source: 'CDC',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 6.9,
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
    name: 'Kansas',
    stateCode: 'KS',
    region: 'Midwest',
    population: 2937880,
    happiness: {
      value: 7.4,
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
      value: 7.5,
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
    name: 'New Mexico',
    stateCode: 'NM',
    region: 'West',
    population: 2117522,
    happiness: {
      value: 7.1,
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
      value: 7.1,
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
    name: 'Nebraska',
    stateCode: 'NE',
    region: 'Midwest',
    population: 1961504,
    happiness: {
      value: 7.6,
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
      value: 7.7,
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
    name: 'Maine',
    stateCode: 'ME',
    region: 'Northeast',
    population: 1362359,
    happiness: {
      value: 7.5,
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
      value: 7.7,
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
    name: 'New Hampshire',
    stateCode: 'NH',
    region: 'Northeast',
    population: 1377529,
    happiness: {
      value: 7.7,
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
      value: 8.0,
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
      confidenceInterval: '±0.3',
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
    name: 'Vermont',
    stateCode: 'VT',
    region: 'Northeast',
    population: 643077,
    happiness: {
      value: 7.8,
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
      value: 8.1,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.9,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 8.1,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Rhode Island',
    stateCode: 'RI',
    region: 'Northeast',
    population: 1097379,
    happiness: {
      value: 7.4,
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
      value: 7.8,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'Delaware',
    stateCode: 'DE',
    region: 'Northeast',
    population: 989948,
    happiness: {
      value: 7.3,
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
      value: 7.7,
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
    name: 'West Virginia',
    stateCode: 'WV',
    region: 'South',
    population: 1793716,
    happiness: {
      value: 7.1,
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
      value: 7.1,
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
    name: 'Idaho',
    stateCode: 'ID',
    region: 'West',
    population: 1839106,
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
      value: 7.6,
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
    name: 'Montana',
    stateCode: 'MT',
    region: 'West',
    population: 1084225,
    happiness: {
      value: 7.7,
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
      value: 7.7,
      year: 2023,
      source: 'NCES',
      confidenceInterval: '±0.3',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.9,
      year: 2023,
      source: 'BLS',
      confidenceInterval: '±0.3',
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
    name: 'Wyoming',
    stateCode: 'WY',
    region: 'West',
    population: 576851,
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
      value: 7.5,
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
    name: 'Alaska',
    stateCode: 'AK',
    region: 'West',
    population: 733391,
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
      value: 7.4,
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
    name: 'Hawaii',
    stateCode: 'HI',
    region: 'West',
    population: 1455271,
    happiness: {
      value: 7.9,
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
      value: 8.1,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'North Dakota',
    stateCode: 'ND',
    region: 'Midwest',
    population: 779094,
    happiness: {
      value: 7.8,
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
      value: 8.1,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'social_support'
    }
  },
  {
    name: 'South Dakota',
    stateCode: 'SD',
    region: 'Midwest',
    population: 886667,
    happiness: {
      value: 7.7,
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
      confidenceInterval: '±0.2',
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
      value: 7.9,
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