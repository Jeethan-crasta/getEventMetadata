import { buildApp } from '../../src/app';
import * as eventService from '../../src/services/eventMetadataService';

describe('POST /event_metadata', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('processes event metadata successfully', async () => {
    jest
      .spyOn(eventService, 'processEventMetadata')
      .mockResolvedValue({ success: true } as any);

    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/v1/lambda/event_metadata',
      payload: {
        bucket: 'test-bucket',
        url: 's3://test-bucket/test-file',
        region: 'us-east-1',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ success: true });
  });

  it('returns 400 when request body is invalid', async () => {
    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/v1/lambda/event_metadata',
      payload: {},
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 500 when service throws', async () => {
    jest
      .spyOn(eventService, 'processEventMetadata')
      .mockRejectedValue(new Error('boom'));

    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/v1/lambda/event_metadata',
      payload: {
        bucket: 'test-bucket',
        url: 's3://test-bucket/test-file',
        region: 'us-east-1',
      },
    });

    expect(res.statusCode).toBe(500);
  });
});
