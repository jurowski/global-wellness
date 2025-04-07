"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const mockData = [
    {
        country: "United States",
        score: 7.2,
        year: 2023,
        rank: 15,
        gdpPerCapita: 1.4,
        socialSupport: 1.3,
        healthyLifeExpectancy: 0.9,
        freedomToMakeChoices: 0.6,
        generosity: 0.2,
        perceptionsOfCorruption: 0.1
    },
    {
        country: "Canada",
        score: 7.4,
        year: 2023,
        rank: 13,
        gdpPerCapita: 1.3,
        socialSupport: 1.4,
        healthyLifeExpectancy: 1.0,
        freedomToMakeChoices: 0.7,
        generosity: 0.3,
        perceptionsOfCorruption: 0.2
    }
];
const handler = async (event) => {
    try {
        const countries = event.queryStringParameters?.countries?.split(',') || [];
        const year = event.queryStringParameters?.year || '2023';
        // Filter by requested countries if specified
        const filteredData = countries.length > 0
            ? mockData.filter(item => countries.includes(item.country))
            : mockData;
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(filteredData),
        };
    }
    catch (error) {
        console.error('Error fetching World Happiness Report data:', error);
        const axiosError = error;
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
exports.handler = handler;
//# sourceMappingURL=index.js.map