import { S3Service } from './s3Service';
import { ProtobufService } from './protobufService';

import { extractAccelerometerData } from '../domain/extractors/accelerometerExtractor';
import { extractAnnotationsMetadata } from '../domain/extractors/annotationsExtractor';
import { extractPathInfo } from '../domain/extractors/pathExtractor';

import { maybeInflate } from '../utils/inflate';
import { EventMetadataRequest } from '../types/eventMetadata';
import { AppError } from '../errors/AppError';

export class EventMetadataService {
  private s3 = new S3Service();
  private proto = new ProtobufService();

  async process(params: EventMetadataRequest) {
    const {
      bucket,
      url,
      region,
      options,
      videoStartTimeUTC,
      videoEndTimeUTC,
    } = params;

    let buffer: Buffer;

    try {
      buffer = await this.s3.getObject(bucket, url, region);
    } catch (err) {
      throw new AppError(
        'Failed to fetch object from S3',
        502,
        'S3_FETCH_FAILED',
        err
      );
    }

    let decodedBuffer: Buffer;

    try {
      decodedBuffer = await maybeInflate(buffer, url);
    } catch (err) {
      throw new AppError(
        'Failed to decompress metadata payload',
        400,
        'METADATA_DECOMPRESSION_FAILED',
        err
      );
    }

    let message: unknown;

    try {
      message = await this.proto.decode(decodedBuffer);
    } catch (err) {
      throw new AppError(
        'Failed to decode protobuf metadata',
        400,
        'PROTOBUF_DECODE_FAILED',
        err
      );
    }

    return {
      ...(options?.includeInertialSensorData && {
        accelerometerData: extractAccelerometerData(
          message,
          videoStartTimeUTC,
          videoEndTimeUTC,
          options.includeRawInertialSensorData
        ),
      }),
      ...(options?.includeAnnotationsMetadata && {
        annotationsMetadata: extractAnnotationsMetadata(message),
      }),
      ...(options?.includePathInfo && {
        pathInfo: extractPathInfo(message),
      }),
    };
  }
}
