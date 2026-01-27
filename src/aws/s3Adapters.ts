import { getObjectRaw } from './s3Client';
import { ImageObject } from '../types/resize';
import { AppError } from '../errors/AppError';

export async function getEventPayloadBuffer(
  bucket: string,
  key: string,
  region: string
): Promise<Buffer> {
  try {
    const { body } = await getObjectRaw(bucket, key, region);

    if (!body) {
      throw new AppError(
        'Object payload is empty',
        422,
        'EMPTY_OBJECT_PAYLOAD'
      );
    }

    return body;
  } catch (error) {
    throw new AppError(
      'Failed to fetch event payload from S3',
      502,
      'S3_GET_OBJECT_FAILED',
      error
    );
  }
}

export async function getObjectWithMetadata(
  bucket: string,
  key: string,
  region: string
): Promise<{
  body: Buffer;
  metadata: Record<string, string>;
}> {
  try {
    const { body, metadata } = await getObjectRaw(bucket, key, region);

    if (!body) {
      throw new AppError(
        'Object payload is empty',
        422,
        'EMPTY_OBJECT_PAYLOAD'
      );
    }

    return {
      body,
      metadata: metadata ?? {},
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      'Failed to fetch object with metadata from S3',
      502,
      'S3_GET_OBJECT_FAILED',
      error
    );
  }
}

export async function getImageObject(
  bucket: string,
  key: string,
  region: string
): Promise<ImageObject> {
  try {
    const { body, metadata, contentType, contentLength } =
      await getObjectRaw(bucket, key, region);

    if (!body) {
      throw new AppError(
        'Image payload is empty',
        422,
        'EMPTY_IMAGE_PAYLOAD'
      );
    }

    return {
      body,
      metadata,
      contentType,
      contentLength,
    };
  } catch (error) {
    throw new AppError(
      'Failed to fetch image object from S3',
      502,
      'S3_GET_IMAGE_FAILED',
      error
    );
  }
}
