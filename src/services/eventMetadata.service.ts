import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../aws/s3Client';
import { AppError } from '../errors/AppError';
import { streamToString } from '../utils/streamToString';
import { EventMetadataRequest } from '../types/eventMetadata';

export async function getEventMetadata(
  params: EventMetadataRequest
) {
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: params.bucket,
        Key: params.key,
      })
    );

    if (!response.Body) {
      throw new AppError('S3 object is empty', 404);
    }

    const content = await streamToString(response.Body as any);
    return JSON.parse(content);
  } catch (err: any) {
    if (err.name === 'NoSuchKey') {
      throw new AppError('Object not found', 404);
    }
    throw new AppError('Failed to fetch metadata', 500, err);
  }
}
