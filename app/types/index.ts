export type CountryCode = string;

export interface CountryData {
  name: string;
  code: CountryCode;
  region?: string;
  population?: number;
} 