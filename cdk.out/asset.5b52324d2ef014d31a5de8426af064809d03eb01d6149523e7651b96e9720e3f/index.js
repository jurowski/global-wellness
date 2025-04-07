"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const axios_1 = __importDefault(require("axios"));
const handler = async (event) => {
    try {
        const countries = event.queryStringParameters?.countries?.split(',') || [];
        const year = event.queryStringParameters?.year || '2023';
        // TODO: Replace with actual API endpoint
        const response = await axios_1.default.get(`https://api.worldhappiness.report/data/${year}`);
        const data = response.data.map((item) => ({
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