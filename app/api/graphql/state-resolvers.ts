import { State, StateData, WellnessMetric } from '../../types/state';

export const stateResolvers = {
  Query: {
    states: async (): Promise<State[]> => {
      try {
        // Return mock data in development/test environment
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
          return [
            {
              name: "California",
              stateCode: "CA",
              region: "West",
              population: 39538223
            },
            {
              name: "Texas",
              stateCode: "TX",
              region: "South",
              population: 29145505
            },
            {
              name: "Florida",
              stateCode: "FL",
              region: "South",
              population: 21538187
            },
            {
              name: "New York",
              stateCode: "NY",
              region: "Northeast",
              population: 20201249
            },
            {
              name: "Illinois",
              stateCode: "IL",
              region: "Midwest",
              population: 12812508
            }
          ];
        }

        // Use the internal API route
        const url = new URL('/api/state-wellness-data', 'http://localhost:3000').toString();
        
        console.log(`Fetching all states from: ${url}`);
        
        // In production with Vercel, we can use a simpler relative URL
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? '/api/state-wellness-data' 
          : url;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching states:', error);
        throw new Error('Failed to fetch states');
      }
    },
    
    state: async (_: any, { stateCode }: { stateCode: string }): Promise<State | null> => {
      try {
        const states = await stateResolvers.Query.states();
        return states.find(state => state.stateCode === stateCode) || null;
      } catch (error) {
        console.error('Error fetching state:', error);
        throw new Error('Failed to fetch state');
      }
    },
    
    compareStates: async (_: any, { stateCodes }: { stateCodes: string[] }): Promise<StateData[]> => {
      try {
        // Use the internal API route for all environments
        const url = new URL('/api/state-wellness-data', 'http://localhost:3000').toString();
        
        console.log(`Fetching state data from: ${url}`);
        
        // In production with Vercel, we can use a simpler relative URL
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? '/api/state-wellness-data' 
          : url;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allStates = await response.json();
        return allStates.filter((state: StateData) => stateCodes.includes(state.stateCode));
      } catch (error) {
        console.error('Error comparing states:', error);
        throw new Error('Failed to compare states');
      }
    }
  }
}; 