import protobuf from 'protobufjs';
import { AppError } from '../errors/AppError';

export class ProtobufService {
  private rootPromise = protobuf.load('src/schema/EventMetadata.proto');

  async decode(buffer: Buffer) {
    let root;

    try {
      root = await this.rootPromise;
    } catch (err) {
      throw new AppError(
        'Failed to load protobuf schema',
        500,
        'PROTOBUF_SCHEMA_LOAD_FAILED',
        err
      );
    }

    let EventMetadata;

    try {
      EventMetadata = root.lookupType('EventMetadata');
    } catch (err) {
      throw new AppError(
        'EventMetadata type not found in protobuf schema',
        500,
        'PROTOBUF_TYPE_NOT_FOUND',
        err
      );
    }

    try {
      return EventMetadata.decode(buffer);
    } catch (err) {
      throw new AppError(
        'Invalid protobuf payload',
        400,
        'PROTOBUF_DECODE_FAILED',
        err
      );
    }
  }
}
