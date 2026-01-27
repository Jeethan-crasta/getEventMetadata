import { buildApp } from '../../src/app';
import * as imageService from '../../src/services/imageService';

describe('POST /resize', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('resizes and uploads image successfully', async () => {
    jest
      .spyOn(imageService, 'resizeAndUploadImage')
      .mockResolvedValue(undefined);

    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/v1/lambda/resize',
      payload: {
        source: {
          bucket: 'src-bucket',
          key: 'src-key',
          region: 'us-east-1',
        },
        target: {
          bucket: 'dest-bucket',
          key: 'dest-key',
          region: 'us-east-1',
          width: 100,
        },
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      status: 'ok',
      message: 'Image resized and uploaded successfully',
    });
  });

  it('returns 400 for invalid body', async () => {
    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/v1/lambda/resize',
      payload: {},
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 500 when service throws', async () => {
    jest
      .spyOn(imageService, 'resizeAndUploadImage')
      .mockRejectedValue(new Error('fail'));

    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/v1/lambda/resize',
      payload: {
        source: {
          bucket: 'src-bucket',
          key: 'src-key',
          region: 'us-east-1',
        },
        target: {
          bucket: 'dest-bucket',
          key: 'dest-key',
          region: 'us-east-1',
          width: 100,
        },
      },
    });

    expect(res.statusCode).toBe(500);
  });
});
