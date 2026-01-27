import { getTimeOfDay } from '../utils/time';
import { AppError } from '../errors/AppError';
import {EventMetadataMessage,RawAccelerometerData,ProcessedAccelerometerData,} from '../types/extractorsTypes';

export function extractAccelerometerData(
  message: EventMetadataMessage,
  start = 0,
  end = 0,
  raw = false
): Array<ProcessedAccelerometerData | RawAccelerometerData> {
  try {
    if (!Array.isArray(message?.accData)) {
      throw new AppError(
        'Invalid protobuf payload: accData is missing or malformed',
        400,
        'INVALID_ACC_DATA'
      );
    }

    return message.accData
      .filter(({ timestamp }) => {
        const ts = Number(timestamp);
        if (Number.isNaN(ts)) return false;
        if (start === 0 && end === 0) return true;
        return ts >= start && ts <= end;
      })
      .map((acc) => {
        const timestampUTC = Number(acc.timestamp);

        if (raw) {
          const gravity =
            Math.sqrt(
              Math.max(
                0,
                acc.x ** 2 +
                  acc.y ** 2 +
                  acc.z ** 2 -
                  acc.globalAccForward ** 2 -
                  acc.globalAccLateral ** 2
              )
            ) || 0;

          return {
            timeOfDay: getTimeOfDay(timestampUTC),
            timestampUTC,
            axes: { x: acc.x, y: acc.y, z: acc.z },
            globalAccForward: acc.globalAccForward,
            globalAccLateral: acc.globalAccLateral,
            speed: acc.speed,
            globalGravity: gravity,
          };
        }

        return {
          timeOfDay: getTimeOfDay(timestampUTC),
          timestampUTC,
          axes: {
            x: 9.8,
            y: acc.filteredGlobalAccLateral,
            z: acc.filteredGlobalAccForward,
          },
        };
      });
  } catch (err) {
    if (err instanceof AppError) throw err;

    throw new AppError(
      'Failed to extract accelerometer data',
      500,
      'ACC_EXTRACTOR_ERROR',
      err
    );
  }
}
