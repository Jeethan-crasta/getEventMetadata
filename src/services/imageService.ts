// src/services/imageService.ts
import Sharp from 'sharp';
import { ResizeRequest } from '../types/resize';
import { AppError } from '../errors/AppError';
import { S3Service } from '../aws/s3Service';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client } from '../aws/aws';

const s3Service = new S3Service();

export async function resizeAndUploadImage(
  payload: ResizeRequest
): Promise<void> {
  const { source, target } = payload;

  try {
    /**
     * 1. Fetch source image using shared S3Service
     */
    const sourceBuffer = await s3Service.getObject(
      source.bucket,
      source.key,
      source.region
    );

    /**
     * 2. Resize image
     */
    const resizedBuffer = await Sharp(sourceBuffer)
      .resize(target.width)
      .withMetadata()
      .toFormat('jpg')
      .toBuffer();

    /**
     * 3. Upload resized image
     */
    const targetClient = getS3Client(target.region);

    await targetClient.send(
      new PutObjectCommand({
        Bucket: target.bucket,
        Key: target.key,
        Body: resizedBuffer,
        ContentType: 'image/jpeg',
      })
    );
  } catch (err) {
    /**
     * Preserve AppErrors
     */
    if (err instanceof AppError) {
      throw err;
    }

    /**
     * Wrap unknown errors
     */
    throw new AppError(
      'Failed to resize and upload image',
      500,
      'IMAGE_RESIZE_FAILED',
      err
    );
  }
}
