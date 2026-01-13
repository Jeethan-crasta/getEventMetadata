import { S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';

const s3Clients = new Map<string, S3Client>();

export function getS3Client(region: string): S3Client {
  if (!s3Clients.has(region)) {
    s3Clients.set(
      region,
      new S3Client({
        region,
        maxAttempts: 3,
        requestHandler: new NodeHttpHandler({
          connectionTimeout: 3000,
          socketTimeout: 5000,
        }),
      })
    );
  }

  return s3Clients.get(region)!;
}
