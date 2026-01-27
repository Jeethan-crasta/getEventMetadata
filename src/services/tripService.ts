import polyline from '@mapbox/polyline';
import { inflate } from 'zlib';
import { promisify } from 'util';

import { decodeBinaryRoute } from '../decoders/binary.decoder';
import { decodeProtobufRoute } from '../decoders/protobuf.decoder';
import { getObjectWithMetadata } from '../aws/s3Adapters';
import type { TripRequest, RoutePoint } from '../types/tripTypes';
import { AppError } from '../errors/AppError';

const inflateAsync = promisify(inflate);

export async function getTripPath(params: TripRequest) {
  const { s3UrlListData, responseFormat } = params;

  const routePathInfo: RoutePoint[] = [];

  for (const s3Url of s3UrlListData) {
    const { bucket, key, region } = s3Url;

    try {
      const { body, metadata } = await getObjectWithMetadata(
        bucket,
        key,
        region
      );

      if (!body) {
        throw new AppError(
          'Route file is empty',
          404,
          'ROUTE_FILE_EMPTY'
        );
      }

      const routefileVersion = resolveRouteFileVersion(metadata);
      const inflated = await inflateAsync(body);

      const decodedPoints =
        routefileVersion > 4
          ? await decodeProtobufRoute(inflated)
          : decodeBinaryRoute(inflated, routefileVersion);

      if (decodedPoints?.length) {
        routePathInfo.push(...decodedPoints);
      }
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }

      throw new AppError(
        `Failed to process route file: ${key}`,
        500,
        'ROUTE_DECODE_FAILED',
        err
      );
    }
  }

  return {
    routePathInfo,
    polylinePathInfo:
      responseFormat === 'POLYLINE'
        ? polyline.encode(
            routePathInfo.map(({ latitude, longitude }) => [
              latitude,
              longitude,
            ])
          )
        : undefined,
  };
}

function resolveRouteFileVersion(
  metadata?: Record<string, string | undefined>
): number {
  if (!metadata) {
    return 0;
  }

  const rawVersion = metadata.routefileversion;
  if (!rawVersion) {
    return 0;
  }

  const version = Number(rawVersion);
  return Number.isFinite(version) && version >= 0 ? version : 0;
}
