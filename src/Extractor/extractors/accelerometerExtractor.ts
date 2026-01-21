import { formatTimeUTC } from '../../utils/time';
import { AppError } from '../../errors/AppError';

export function extractAccelerometerData(
  message: any,
  start = 0,
  end = 0,
  raw = false
) {
  if (!Array.isArray(message?.accData)) {
    throw new AppError(
      'Invalid protobuf payload: accData is missing or malformed',
      400
    );
  }

  return message.accData
    .filter((acc: any) => {
  const ts = Number(acc.timestamp);

  if (start === 0 && end === 0) {
    return true;
  }

  return ts >= start && ts <= end;
    })
    .map((acc: any) => {
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
          timeOfDay: formatTimeUTC(timestampUTC),
          timestampUTC,
          axes: { x: acc.x, y: acc.y, z: acc.z },
          globalAccForward: acc.globalAccForward,
          globalAccLateral: acc.globalAccLateral,
          speed: acc.speed,
          globalGravity: gravity,
        };
      }

      return {
        timeOfDay: formatTimeUTC(timestampUTC),
        timestampUTC,
        axes: {
          x: 9.8,
          y: acc.filteredGlobalAccLateral,
          z: acc.filteredGlobalAccForward,
        },
      };
    });
}
