import { describe, it, expect, afterEach } from 'vitest';
import { buildApp } from '../../src/app';

describe('GET /health', () => {
  const app = buildApp();

  afterEach(async () => {
    await app.close();
  });

  it('returns ok', async () => {
    await app.ready(); // 🔑 VERY IMPORTANT

    const res = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });
});
