export interface WellnessMetric {
  value: number;
  year: number;
  source: string;
  confidenceInterval: string;
  isRealData: boolean;
  category: string;
}

export interface State {
  name: string;
  stateCode: string;
  region: string;
  population: number;
}

export interface StateData extends State {
  happiness: WellnessMetric;
  healthcare: WellnessMetric;
  education: WellnessMetric;
  work_life: WellnessMetric;
  social_support: WellnessMetric;
} 