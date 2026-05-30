import request from 'supertest';

// Set required env vars before importing app (env.ts validates at import time)
process.env.OPENAI_API_KEY = 'test-key';
process.env.PORT = '3001';
process.env.CLIENT_URL = 'http://localhost:5173';

import app from '../../../src/server/src/app';

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
    expect(res.body).toHaveProperty('timestamp');
  });

  it('responds with JSON content-type', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});
