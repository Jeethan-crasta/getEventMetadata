import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { env } from './env';

export function createS3Client(region: string): S3Client {
  const config: S3ClientConfig = {
    region,
    maxAttempts: 3,
  };

  console.info('[AWS] Creating S3 client', { region });

  return new S3Client(config);
}
