import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client } from '../config/aws';
import { AppError } from '../errors/AppError';

export class S3Service {

  async getObject(
    bucket: string,
    url: string,
    region: string
  ): Promise<Buffer> {
    let response;

    try {
      const client = getS3Client(region);
      response = await client.send(
        new GetObjectCommand({ Bucket: bucket, Key: url })
      );
    } catch (err:any) {
      const redirectRegion =
        err?.$metadata?.httpHeaders?.['x-amz-bucket-region'];

      if (redirectRegion && redirectRegion !== region) {
        try {
          const retryClient = getS3Client(redirectRegion);
          response = await retryClient.send(
            new GetObjectCommand({ Bucket: bucket, Key: url })
          );
        } catch (retryErr) {
          throw new AppError(
            'Failed to fetch object from S3 after region redirect',
            502,
            'S3_REDIRECT_FETCH_FAILED',
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

    if (!response.Body) {
      throw new AppError(
        'S3 object body is empty',
        502,
        'S3_EMPTY_BODY'
      );
    }

    try {
      const bytes = await response.Body.transformToByteArray();
      return Buffer.from(bytes);
    } catch (err) {
      throw new AppError(
        'Failed to read S3 object stream',
        502,
        'S3_STREAM_READ_FAILED',
        err
      );
    }
  }
}
