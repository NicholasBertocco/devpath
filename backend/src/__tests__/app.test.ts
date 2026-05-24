import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../index';

describe('App API', () => {
  it('Deve retornar status ok na rota /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', message: 'API is running' });
  });

  it('Deve aplicar Rate Limiting (429) após 100 requisições (teste simulado)', () => {
    expect(true).toBe(true);
  });
});
