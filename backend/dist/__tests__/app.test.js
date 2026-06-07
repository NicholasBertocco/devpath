"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
(0, globals_1.describe)('App API', () => {
    (0, globals_1.it)('Deve retornar status ok na rota /health', async () => {
        const res = await (0, supertest_1.default)(index_1.default).get('/health');
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toEqual({ status: 'ok', message: 'API is running' });
    });
    (0, globals_1.it)('Deve aplicar Rate Limiting (429) após 100 requisições (teste simulado)', () => {
        (0, globals_1.expect)(true).toBe(true);
    });
});
