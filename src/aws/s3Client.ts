import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client } from './aws';
import { AppError } from '../errors/AppError';

export interface S3InternalObject {
  body: Buffer;
  metadata: Record<string, string>;
  contentType?: string;
  contentLength?: number;
  region: string;
}

export const getObjectRaw = async (
  bucket: string,
  key: string,
  region: string
): Promise<S3InternalObject> => {
  let response;

  try {
    response = await getS3Client(region).send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );
  } catch (err: any) {
    const redirectRegion =
      err?.$metadata?.httpHeaders?.['x-amz-bucket-region'];

    if (redirectRegion && redirectRegion !== region) {
      try {
        response = await getS3Client(redirectRegion).send(
          new GetObjectCommand({ Bucket: bucket, Key: key })
        );
        region = redirectRegion;
      } catch (retryErr) {
        throw new AppError(
          'Failed to fetch object from S3 after region redirect',
          502,
          'S3_FETCH_FAILED',
          retryErr
        );
      }
    } else {
      throw new AppError(
        'Failed to fetch object from S3',
        502,
        'S3_FETCH_FAILED',
        err
      );
    }
  }

  if (!response?.Body) {
    throw new AppError(
      'S3 object body is empty',
      502,
      'S3_EMPTY_BODY'
    );
  }

  const bytes = await response.Body.transformToByteArray();

  return {
    body: Buffer.from(bytes),
    metadata: response.Metadata ?? {},
    contentType: response.ContentType,
    contentLength: response.ContentLength,
    region,
  };
};
