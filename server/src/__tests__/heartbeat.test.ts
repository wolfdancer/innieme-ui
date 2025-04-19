import request from 'supertest';
import app from '../app';

describe('Heartbeat API', () => {
    test('should respond with correct structure for a simple message', async () => {
        const message = 'hello';
        const response = await request(app)
            .get(`/api/heartbeat?message=${message}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(response.body).toHaveProperty('ping', message);
        expect(response.body).toHaveProperty('pong', 'olleh');
        expect(response.body).toHaveProperty('received');
        expect(response.body).toHaveProperty('responded');
    });

    test('should handle empty message', async () => {
        const response = await request(app)
            .get('/api/heartbeat')
            .expect(200);

        expect(response.body).toHaveProperty('ping', '');
        expect(response.body).toHaveProperty('pong', '');
    });

    test('should handle special characters', async () => {
        const message = 'hello!@#$';
        const response = await request(app)
            .get(`/api/heartbeat?message=${encodeURIComponent(message)}`)
            .expect(200);

        expect(response.body).toHaveProperty('ping', message);
        expect(response.body).toHaveProperty('pong', '$#@!olleh');
    });
});