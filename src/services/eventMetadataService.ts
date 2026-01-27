import { getEventPayloadBuffer } from '../aws/s3Adapters';
import { ProtobufLoader } from '../utils/protobufLoader';

import { extractAccelerometerData } from '../Extractor/accelerometerExtractor';
import { extractAnnotationsMetadata } from '../Extractor/annotationsExtractor';
import { extractPathInfo } from '../Extractor/pathExtractor';

import { inflate } from 'zlib';
import { promisify } from 'util';

import { EventMetadataRequest } from '../types/eventMetadata';
import { AppError } from '../errors/AppError';
import { EventMetadataMessage } from '../types/extractorsTypes';

const inflateAsync = promisify(inflate);


async function maybeInflate(
  buffer: Buffer,
  fileName: string
): Promise<Buffer> {
  const needsInflation =
    fileName.endsWith('.zlib') || fileName.endsWith('.pbf.zlib');

  if (!needsInflation) {
    return buffer;
  }

  try {
    return await inflateAsync(buffer);
  } catch (err) {
    throw new AppError(
      'Failed to inflate compressed metadata',
      400,
      'METADATA_DECOMPRESSION_FAILED',
      err
    );
  }
}


function decodeProtobuf(buffer: Buffer) {
  try {
    const type = ProtobufLoader.getEventMetadataType();
    const decoded = type.decode(buffer);

    return type.toObject(decoded, {
      longs: Number,
      enums: String,
      defaults: true,
      arrays: true,
      objects: true,
    });
  } catch (err) {
    throw new AppError(
      'Failed to decode protobuf metadata',
      400,
      'PROTOBUF_DECODE_FAILED',
      err
    );
  }
}


export async function processEventMetadata(
  params: EventMetadataRequest
) {
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
    buffer = await getEventPayloadBuffer(bucket, url, region);
  } catch (err) {
    throw new AppError(
      'Failed to fetch object from S3',
      502,
      'S3_FETCH_FAILED',
      err
    );
  }

  const decodedBuffer = await maybeInflate(buffer, url);
  const message = decodeProtobuf(decodedBuffer)as EventMetadataMessage;

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
