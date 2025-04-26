import request from 'supertest';
import {initializeApp} from '../app';
import { EchoConversationService } from '../services/EchoConversationService';


const echoService = new EchoConversationService();
const app = initializeApp(echoService);


describe('Chat API', () => {

    test('should handle basic chat message successfully', async () => {
        const payload = {
            message: 'Hello AI'
        };

        const response = await request(app)
            .post('/api/chat')
            .send(payload)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(response.body).toMatchObject({
            ping: 'Hello AI',
            pong: 'IA olleH'
        });
        expect(new Date(response.body.received)).toBeInstanceOf(Date);
        expect(new Date(response.body.responded)).toBeInstanceOf(Date);
    });

    test('should handle chat with history', async () => {
        const payload = {
            message: 'Hello again',
            history: [
                { role: 'user', content: 'Previous message' }
            ]
        };

        const response = await request(app)
            .post('/api/chat')
            .send(payload)
            .expect(200);

        expect(response.body).toMatchObject({
            ping: 'Hello again',
            pong: 'niaga olleH\negassem suoiverP'
        });
    });

    test('should handle service errors', async () => {
        const payload = {
            message: 'trigger-error'
        };

        const response = await request(app)
            .post('/api/chat')
            .send(payload)
            .expect(500);

        expect(response.body).toMatchObject({
            error: 'Failed to process message with conversation service',
            details: 'Triggered error as requested'
        });
    });

    test('should handle missing message field', async () => {
        const payload = {};

        const response = await request(app)
            .post('/api/chat')
            .send(payload)
            .expect(500);  // Express will treat empty message as empty string

        expect(response.body).toMatchObject({
            error: 'Failed to process message with conversation service',
            details: 'Cannot read properties of undefined (reading \'split\')'
        });
    });
});