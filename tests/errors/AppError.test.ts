import { AppError } from '../../src/errors/AppError';

describe('AppError', () => {
  it('sets status code', () => {
    const err = new AppError('Error', 500);
    expect(err.statusCode).toBe(500);
  });

  it('sets custom status code', () => {
    const err = new AppError('Not Found', 404);
    expect(err.statusCode).toBe(404);
  });

  it('sets default error code', () => {
    const err = new AppError('Error', 500);
    expect(err.code).toBe('APP_ERROR');
  });

  it('is instance of Error', () => {
    const err = new AppError('Boom', 500);
    expect(err).toBeInstanceOf(Error);
  });
});
