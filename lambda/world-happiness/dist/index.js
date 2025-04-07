"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const handler = async (event) => {
    try {
        const countries = event.queryStringParameters?.countries?.split(',') || [];
        const year = parseInt(event.queryStringParameters?.year || '2023');
        let data = [];
        if (countries.length > 0) {
            // Query for specific countries
            const countryPromises = countries.map(async (country) => {
                const command = new lib_dynamodb_1.QueryCommand({
                    TableName: process.env.TABLE_NAME,
                    KeyConditionExpression: 'countryYear = :countryYear AND country = :country',
                    ExpressionAttributeValues: {
                        ':countryYear': `${year}`,
                        ':country': country,
                    },
                });
                const response = await docClient.send(command);
                return response.Items?.[0];
            });
            const results = await Promise.all(countryPromises);
            data = results.filter((item) => item !== undefined);
        }
        else {
            // Query by year using the GSI
            const command = new lib_dynamodb_1.QueryCommand({
                TableName: process.env.TABLE_NAME,
                IndexName: process.env.TABLE_YEAR_INDEX,
                KeyConditionExpression: '#year = :year',
                ExpressionAttributeNames: {
                    '#year': 'year',
                },
                ExpressionAttributeValues: {
                    ':year': year,
                },
            });
            const response = await docClient.send(command);
            data = (response.Items || []);
        }
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(data),
        };
    }
    catch (error) {
        console.error('Error fetching World Happiness Report data:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                message: 'Error fetching World Happiness Report data',
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=index.js.map