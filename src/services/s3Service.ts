import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { AppError } from '../errors/AppError';

export class S3Service {
  private clients: Record<string, S3Client> = {};

  private client(region: string) {
    if (!this.clients[region]) {
      this.clients[region] = new S3Client({ region });
    }
    return this.clients[region];
  }

  async getObject(
    bucket: string,
    key: string,
    region: string
  ): Promise<Buffer> {
    let response;

    try {
      response = await this.client(region).send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
      );
    } catch (err) {
      throw new AppError(
        'Failed to fetch object from S3',
        502,
        'S3_FETCH_FAILED',
        err
      );
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
