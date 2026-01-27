jest.mock('sharp', () => {
  return () => ({
    resize: () => ({
      withMetadata: () => ({
        toFormat: () => ({
          toBuffer: async () => Buffer.from('resized'),
        }),
      }),
    }),
  });
});
import { resizeAndUploadImage } from '../../src/services/imageService';
import * as s3Adapters from '../../src/aws/s3Adapters';
import * as aws from '../../src/aws/aws';

jest.spyOn(s3Adapters, 'getImageObject').mockResolvedValue({
  body: Buffer.from('image'),
  metadata: {},
});


jest.spyOn(aws, 'getS3Client').mockReturnValue({
  send: jest.fn().mockResolvedValue({}),
} as any);

describe('imageService', () => {
  it('resizes and uploads image successfully', async () => {
    await expect(
      resizeAndUploadImage({
        source: {
          bucket: 'src',
          key: 'img.jpg',
          region: 'us-east-1',
        },
        target: {
          bucket: 'dst',
          key: 'out.jpg',
          region: 'us-east-1',
          width: 100,
        },
      })
    ).resolves.toBeUndefined();
  });

  it('throws when source image is missing', async () => {
    (s3Adapters.getImageObject as jest.Mock).mockResolvedValueOnce({});

    await expect(
      resizeAndUploadImage({
        source: {
          bucket: 'src',
          key: 'img.jpg',
          region: 'us-east-1',
        },
        target: {
          bucket: 'dst',
          key: 'out.jpg',
          region: 'us-east-1',
          width: 100,
        },
      })
    ).rejects.toThrow();
  });
});
