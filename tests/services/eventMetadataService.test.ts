import { describe, it, expect, vi } from 'vitest';
import { EventMetadataService } from '../../src/services/eventMetadataService';
import { AppError } from '../../src/errors/AppError';

// 👇 mock as a CLASS
vi.mock('../../src/services/s3Service', () => {
  return {
    S3Service: class {
      getObject() {
        return Promise.reject(new Error('S3 fail'));
      }
    },
  };
});

// protobuf is not reached in this test, but mock it safely
vi.mock('../../src/services/protobufService', () => {
  return {
    ProtobufService: class {
      decode() {
        return {};
      }
    },
  };
});

describe('EventMetadataService', () => {
  it('throws AppError when S3 fetch fails', async () => {
    const service = new EventMetadataService();

    await expect(
      service.process({
        bucket: 'b',
        url: 'u',
        region: 'r',
      } as any)
    ).rejects.toBeInstanceOf(AppError);
  });
});
