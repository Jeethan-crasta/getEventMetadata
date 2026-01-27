import { getTimeOfDay } from '../utils/time';
import { getCameraStatus } from '../utils/cameraStatus';
import { AppError } from '../errors/AppError';
import {EventMetadataMessage,PathInfoResult,} from '../types/extractorsTypes';

export function extractPathInfo(message: EventMetadataMessage): PathInfoResult {
  try {
    if (!Array.isArray(message?.locationData)) {
      throw new AppError(
        'Invalid protobuf payload: locationData is missing or malformed',
        400,
        'INVALID_LOCATION_DATA'
      );
    }

   return {
  routePathInfo: message.locationData.map((d) => {
    const timestamp = Number(d.timestamp);

    return {
      timeOfDay: getTimeOfDay(timestamp),
      timestampUTC: timestamp,
      latitude: d.latitude,
      longitude: d.longitude,
      speed: d.speed,
      bearing: Math.abs(d.bearing) > 360 ? d.bearing / 100 : d.bearing,
      accuracy: d.accuracy < 0 ? 100 : Math.round(d.accuracy),
      cameraConnectionState: getCameraStatus(d.connectionStatus),
    };
  }),
};

  } catch (err) {
    if (err instanceof AppError) throw err;

    throw new AppError(
      'Failed to extract path information',
      500,
      'PATH_EXTRACTOR_ERROR',
      err
    );
  }
}
