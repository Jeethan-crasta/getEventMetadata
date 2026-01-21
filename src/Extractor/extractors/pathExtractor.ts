import { formatTimeUTC } from '../../utils/time';
import { mapCameraStatus } from '../../utils/cameraStatus';
import { AppError } from '../../errors/AppError';

export function extractPathInfo(message: any) {
  if (!Array.isArray(message?.locationData)) {
    throw new AppError(
      'Invalid protobuf payload: locationData is missing or malformed',
      400
    );
  }

  return {
    routePathInfo: message.locationData.map((d: any) => ({
      timeOfDay: formatTimeUTC(d.timestamp),
      timestampUTC: Number(d.timestamp),
      latitude: d.latitude,
      longitude: d.longitude,
      speed: d.speed,
      bearing: Math.abs(d.bearing) > 360 ? d.bearing / 100 : d.bearing,
      accuracy: d.accuracy < 0 ? 100 : Math.round(d.accuracy),
      cameraConnectionState: mapCameraStatus(d.connectionStatus),
    })),
  };
}
