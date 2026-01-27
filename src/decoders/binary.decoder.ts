import { BufferReader } from '../utils/buffer-reader';
import { getTimeOfDay } from '../utils/time';
import { getCameraStatus } from '../utils/cameraStatus';
import { AppError } from '../errors/AppError';

export function decodeBinaryRoute(
  buffer: Buffer,
  version: number
) {
  try {
    const reader = new BufferReader(buffer);
    const points = [];

    while (reader.isOpen(50)) {
      const timestamp = reader.readLong();
      const lat = reader.readInt() / 1e6;
      const lng = reader.readInt() / 1e6;
      const speed = reader.readShort() / 100;
      const bearing = reader.readShort();
      const accuracy = reader.readShort();

      reader.increment(29);

      const cameraConnectionState =
        version >= 4
          ? getCameraStatus(reader.readByte())
          : getCameraStatus();

      points.push({
        timeOfDay: getTimeOfDay(timestamp),
        timestampUTC: timestamp,
        latitude: lat,
        longitude: lng,
        speed,
        bearing:
          Math.abs(bearing) > 360 ? bearing / 100 : bearing,
        accuracy: accuracy < 0 ? 100 : accuracy,
        cameraConnectionState,
      });
    }

    return points;
  } catch (err) {
    throw new AppError(
      'Invalid binary route payload',
      400,
      'BINARY_DECODE_ERROR',
      err
    );
  }
}
