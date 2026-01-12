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
    
     // Fetch from S3
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

    // Inflate
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

    //  Decode protobuf 
    try {
      message = ProtobufService.decode(decodedBuffer);
    } catch (err) {
      throw new AppError(
        'Failed to decode protobuf metadata',
        400,
        'PROTOBUF_DECODE_FAILED',
        err
      );
    }


    // Extract requested data
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
