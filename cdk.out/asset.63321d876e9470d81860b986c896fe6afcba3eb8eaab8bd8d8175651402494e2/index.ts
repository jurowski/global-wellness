import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios, { AxiosError } from 'axios';

interface HappinessData {
  country: string;
  score: number;
  year: number;
  rank: number;
  gdpPerCapita: number;
  socialSupport: number;
  healthyLifeExpectancy: number;
  freedomToMakeChoices: number;
  generosity: number;
  perceptionsOfCorruption: number;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const countries = event.queryStringParameters?.countries?.split(',') || [];
    const year = event.queryStringParameters?.year || '2023';

    // TODO: Replace with actual API endpoint
    const response = await axios.get(`https://api.worldhappiness.report/data/${year}`);

    const data: HappinessData[] = response.data.map((item: any) => ({
      country: item.country,
      score: item.score,
      year: parseInt(year),
      rank: item.rank,
      gdpPerCapita: item.gdpPerCapita,
      socialSupport: item.socialSupport,
      healthyLifeExpectancy: item.healthyLifeExpectancy,
      freedomToMakeChoices: item.freedomToMakeChoices,
      generosity: item.generosity,
      perceptionsOfCorruption: item.perceptionsOfCorruption,
    }));

    // Filter by requested countries if specified
    const filteredData = countries.length > 0
      ? data.filter(item => countries.includes(item.country))
      : data;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(filteredData),
    };
  } catch (error) {
    console.error('Error fetching World Happiness Report data:', error);

    const axiosError = error as AxiosError;
    return {
      statusCode: axiosError.response?.status || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Error fetching World Happiness Report data',
        error: axiosError.message,
      }),
    };
  }
}; 