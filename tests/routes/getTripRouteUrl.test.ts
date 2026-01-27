import { buildApp } from '../../src/app';
import * as tripService from '../../src/services/tripService';

describe('POST /get_path', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns trip path for valid request', async () => {
    jest
      .spyOn(tripService, 'getTripPath')
      .mockResolvedValue({ path: 'some-path' } as any);

    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/v1/lambda/get_path',
      payload: {
        s3UrlListData: [
          { region: 'us-east-1', bucket: 'test-bucket', key: 'test-key' }
        ],
        responseFormat: 'RAW',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ path: 'some-path' });
  });

  it('returns 400 when body is missing', async () => {
    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/v1/lambda/get_path',
      payload: {},
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 500 on service error', async () => {
    jest
      .spyOn(tripService, 'getTripPath')
      .mockRejectedValue(new Error('boom'));

    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/v1/lambda/get_path',
      payload: {
        s3UrlListData: [
          { region: 'us-east-1', bucket: 'test-bucket', key: 'test-key' }
        ],
        responseFormat: 'RAW',
      },
    });

    expect(res.statusCode).toBe(500);
  });
});
