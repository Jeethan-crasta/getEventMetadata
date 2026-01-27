import {
  getEventPayloadBuffer,
  getObjectWithMetadata,
  getImageObject,
} from '../../src/aws/s3Adapters';
import { AppError } from '../../src/errors/AppError';

jest.mock('../../src/aws/s3Client', () => ({
  getObjectRaw: jest.fn(),
}));

import { getObjectRaw } from '../../src/aws/s3Client';

describe('s3Adapters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEventPayloadBuffer', () => {
    it('returns body buffer', async () => {
      (getObjectRaw as jest.Mock).mockResolvedValue({
        body: Buffer.from('data'),
      });

      const result = await getEventPayloadBuffer('bucket', 'key', 'region');
      expect(result).toEqual(Buffer.from('data'));
    });

    it('throws AppError when body is empty', async () => {
      (getObjectRaw as jest.Mock).mockResolvedValue({ body: undefined });

      await expect(
        getEventPayloadBuffer('bucket', 'key', 'region')
      ).rejects.toBeInstanceOf(AppError);
    });
  });

  describe('getObjectWithMetadata', () => {
    it('returns body and metadata', async () => {
      (getObjectRaw as jest.Mock).mockResolvedValue({
        body: Buffer.from('data'),
        metadata: { foo: 'bar' },
      });

      const result = await getObjectWithMetadata('bucket', 'key', 'region');

      expect(result.body).toEqual(Buffer.from('data'));
      expect(result.metadata).toEqual({ foo: 'bar' });
    });

    it('defaults metadata to empty object', async () => {
      (getObjectRaw as jest.Mock).mockResolvedValue({
        body: Buffer.from('data'),
      });

      const result = await getObjectWithMetadata('bucket', 'key', 'region');
      expect(result.metadata).toEqual({});
    });
  });

  describe('getImageObject', () => {
    it('returns image object data', async () => {
      (getObjectRaw as jest.Mock).mockResolvedValue({
        body: Buffer.from('img'),
        metadata: { width: '100' },
        contentType: 'image/png',
        contentLength: 123,
      });

      const result = await getImageObject('bucket', 'key', 'region');

      expect(result.body).toEqual(Buffer.from('img'));
      expect(result.contentType).toBe('image/png');
      expect(result.contentLength).toBe(123);
    });

    it('throws AppError when body is empty', async () => {
      (getObjectRaw as jest.Mock).mockResolvedValue({ body: undefined });

      await expect(
        getImageObject('bucket', 'key', 'region')
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
