"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var client = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-1' });
var docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
var statesData = [
    {
        stateCode: 'CA',
        name: 'California',
        region: 'West',
        population: 39538223,
        metrics: {
            happiness: {
                value: 7.2,
                year: 2023,
                source: 'Gallup-Sharecare Well-Being Index',
                confidenceInterval: [6.8, 7.6],
                isRealData: true,
                category: 'Well-being'
            },
            healthcare: {
                value: 8.1,
                year: 2023,
                source: 'Commonwealth Fund',
                confidenceInterval: [7.7, 8.5],
                isRealData: true,
                category: 'Healthcare'
            },
            education: {
                value: 7.8,
                year: 2023,
                source: 'Education Week',
                confidenceInterval: [7.4, 8.2],
                isRealData: true,
                category: 'Education'
            },
            work_life: {
                value: 7.5,
                year: 2023,
                source: 'OECD Better Life Index',
                confidenceInterval: [7.1, 7.9],
                isRealData: true,
                category: 'Work-Life Balance'
            },
            social_support: {
                value: 7.9,
                year: 2023,
                source: 'Gallup-Sharecare Well-Being Index',
                confidenceInterval: [7.5, 8.3],
                isRealData: true,
                category: 'Social Support'
            }
        }
    },
    {
        stateCode: 'NY',
        name: 'New York',
        region: 'Northeast',
        population: 20201249,
        metrics: {
            happiness: {
                value: 7.0,
                year: 2023,
                source: 'Gallup-Sharecare Well-Being Index',
                confidenceInterval: [6.6, 7.4],
                isRealData: true,
                category: 'Well-being'
            },
            healthcare: {
                value: 8.3,
                year: 2023,
                source: 'Commonwealth Fund',
                confidenceInterval: [7.9, 8.7],
                isRealData: true,
                category: 'Healthcare'
            },
            education: {
                value: 8.0,
                year: 2023,
                source: 'Education Week',
                confidenceInterval: [7.6, 8.4],
                isRealData: true,
                category: 'Education'
            },
            work_life: {
                value: 7.2,
                year: 2023,
                source: 'OECD Better Life Index',
                confidenceInterval: [6.8, 7.6],
                isRealData: true,
                category: 'Work-Life Balance'
            },
            social_support: {
                value: 7.7,
                year: 2023,
                source: 'Gallup-Sharecare Well-Being Index',
                confidenceInterval: [7.3, 8.1],
                isRealData: true,
                category: 'Social Support'
            }
        }
    }
];
function seedData() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, statesData_1, state, command, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    _i = 0, statesData_1 = statesData;
                    _a.label = 1;
                case 1:
                    if (!(_i < statesData_1.length)) return [3 /*break*/, 4];
                    state = statesData_1[_i];
                    command = new lib_dynamodb_1.PutCommand({
                        TableName: 'states-wellness-data',
                        Item: state
                    });
                    return [4 /*yield*/, docClient.send(command)];
                case 2:
                    _a.sent();
                    console.log("Successfully seeded data for ".concat(state.name));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log('Data seeding completed successfully');
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error seeding data:', error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
seedData();
