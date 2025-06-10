const request = require('supertest');
const app = require('../app');

describe('EEI API Endpoints', () => {
    describe('GET /', () => {
        it('should return API information', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('EEI Network API Server');
        });
    });

    describe('GET /health', () => {
        it('should return health status', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('healthy');
        });
    });

    describe('GET /api/stats/summary', () => {
        it('should return database statistics', async () => {
            const res = await request(app).get('/api/stats/summary');
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
        });
    });
});