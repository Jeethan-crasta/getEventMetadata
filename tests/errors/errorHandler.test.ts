import Fastify from 'fastify';
import { errorHandler } from '../../src/errors/errorHandler';
import { AppError } from '../../src/errors/AppError';

describe('errorHandler', () => {
  let app: ReturnType<typeof Fastify>;

  beforeEach(() => {
    app = Fastify();

    app.setErrorHandler(errorHandler);

    app.get('/app-error', async () => {
      throw new AppError('Bad Request', 400);
    });

    app.get('/unknown-error', async () => {
      throw new Error('Crash');
    });
  });

  it('handles AppError correctly', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/app-error',
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({
      statusCode: 400,
      code: 'APP_ERROR',
      error: 'Bad Request',
    });
  });

  it('handles unknown error as 500', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/unknown-error',
    });

    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
      error: 'Internal Server Error',
    });
  });
});
