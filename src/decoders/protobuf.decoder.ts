import protobuf from 'protobufjs';
import { getTimeOfDay } from '../utils/time';
import { getCameraStatus } from '../utils/cameraStatus';
import { AppError } from '../errors/AppError';
import { ProtobufLoader } from '../utils/protobufLoader';



export async function decodeProtobufRoute(buffer: Buffer) {
  try {
    const Location = ProtobufLoader.getRouteLocationType();
    const reader = protobuf.Reader.create(buffer);

    const points = [];

    while (reader.pos < reader.len) {
      const msg = Location.decodeDelimited(reader) as any;

      const ts = Number(msg.timestamp);
      const bearingVal = msg.bearing;
      const accuracyVal = msg.accuracy;

      points.push({
        timeOfDay: getTimeOfDay(ts),
        timestampUTC: ts,
        latitude: msg.latitude,
        longitude: msg.longitude,
        speed: msg.speed,
        bearing:
          Math.abs(bearingVal) > 360 ? bearingVal / 100 : bearingVal,
        accuracy: accuracyVal < 0 ? 100 : Math.round(accuracyVal),
        cameraConnectionState: getCameraStatus(msg.connectionStatus),
      });
    }

    return points;
  } catch (err) {
    throw new AppError(
      'Invalid protobuf route payload',
      400,
      'PROTOBUF_DECODE_ERROR',
      err
    );
  }
}
