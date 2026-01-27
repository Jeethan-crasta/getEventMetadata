// src/services/imageService.ts
import { PutObjectCommand } from '@aws-sdk/client-s3';
import Sharp from 'sharp';
import { ResizeRequest } from '../types/resize';
import { getImageObject } from '../aws/s3Adapters';
import { getS3Client } from '../aws/aws';
import { AppError } from '../errors/AppError';

export async function resizeAndUploadImage(
  payload: ResizeRequest
): Promise<void> {
  const { source, target } = payload;

  try {
    const sourceObject = await getImageObject(
      source.bucket,
      source.key,
      source.region
    );

    if (!sourceObject?.body) {
      throw new AppError(
        'Source image not found or empty',
        404,
        'IMAGE_SOURCE_NOT_FOUND'
      );
    }

    const resizedBuffer = await Sharp(sourceObject.body)
      .resize(target.width)
      .withMetadata()
      .toFormat('jpg')
      .toBuffer();

    await getS3Client(target.region).send(
      new PutObjectCommand({
        Bucket: target.bucket,
        Key: target.key,
        Body: resizedBuffer,
        ContentType: 'image/jpg',
      })
    );
  } catch (err) {
    if (err instanceof AppError) {
      throw err; 
    }

    throw new AppError(
      'Failed to resize and upload image',
      500,
      'IMAGE_PROCESSING_FAILED',
      err
    );
  }
}
