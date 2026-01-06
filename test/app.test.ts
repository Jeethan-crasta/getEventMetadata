import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { buildApp } from '../src/app';
import { FastifyInstance } from 'fastify';

let app: FastifyInstance;

beforeAll(async () => {
  app = buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('Health Check', () => {
  test('GET /health should return status ok', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });
});

describe('POST /event-metadata validation', () => {
  test('should return 400 for missing bucket', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/event-metadata',
      payload: { url: 'someurl', region: 'us-east-1' },
    });

    expect(response.statusCode).toBe(400);
  });

  test('should return 400 for missing url', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/event-metadata',
      payload: { bucket: 'somebucket', region: 'us-east-1' },
    });

    expect(response.statusCode).toBe(400);
  });

  test('should return 400 for missing region', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/event-metadata',
      payload: { bucket: 'somebucket', url: 'someurl' },
    });

    expect(response.statusCode).toBe(400);
  });
});
