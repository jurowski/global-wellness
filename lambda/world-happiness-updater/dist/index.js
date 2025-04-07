"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const handler = async () => {
    try {
        // Download the latest data from Kaggle or World Happiness Report website
        // For now, we'll use sample data for 2023
        const sampleData = [
            {
                Country: 'Finland',
                'Happiness Score': 7.804,
                'GDP per capita': 1.888,
                'Social support': 1.585,
                'Healthy life expectancy': 0.535,
                'Freedom to make life choices': 0.772,
                Generosity: 0.126,
                'Perceptions of corruption': 0.535,
                Year: 2023,
                Rank: 1
            },
            {
                Country: 'Denmark',
                'Happiness Score': 7.586,
                'GDP per capita': 1.949,
                'Social support': 1.582,
                'Healthy life expectancy': 0.565,
                'Freedom to make life choices': 0.758,
                Generosity: 0.208,
                'Perceptions of corruption': 0.525,
                Year: 2023,
                Rank: 2
            }
        ];
        // Transform the data
        const transformedData = sampleData.map(item => ({
            countryYear: `${item.Year}`,
            country: item.Country,
            score: item['Happiness Score'],
            year: item.Year,
            rank: item.Rank,
            gdpPerCapita: item['GDP per capita'],
            socialSupport: item['Social support'],
            healthyLifeExpectancy: item['Healthy life expectancy'],
            freedomToMakeChoices: item['Freedom to make life choices'],
            generosity: item.Generosity,
            perceptionsOfCorruption: item['Perceptions of corruption']
        }));
        // Write to DynamoDB in batches
        const batchSize = 25;
        for (let i = 0; i < transformedData.length; i += batchSize) {
            const batch = transformedData.slice(i, i + batchSize);
            const command = new lib_dynamodb_1.BatchWriteCommand({
                RequestItems: {
                    [process.env.TABLE_NAME]: batch.map(item => ({
                        PutRequest: {
                            Item: item
                        }
                    }))
                }
            });
            await docClient.send(command);
        }
        console.log('Successfully updated happiness data');
    }
    catch (error) {
        console.error('Error updating happiness data:', error);
        throw error;
    }
};
exports.handler = handler;
//# sourceMappingURL=index.js.map