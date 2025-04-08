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
  // Add more states as needed
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