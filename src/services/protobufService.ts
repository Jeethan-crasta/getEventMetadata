import protobuf from 'protobufjs';
import path from 'path';
import { AppError } from '../errors/AppError';

let EventMetadataType: protobuf.Type | null = null;
let initialized = false;

export class ProtobufService {
 
  static async init(): Promise<void> {
    if (initialized) return;

    try {
      const protoPath = path.resolve(
        process.cwd(),
        'src/schema/EventMetadata.proto'
      );

      const root = await protobuf.load(protoPath);
      const type = root.lookupType('EventMetadata');

      if (!type) {
        throw new Error('EventMetadata type not found in proto schema');
      }

      EventMetadataType = type;
      initialized = true;

      console.log('Protobuf schema initialized');
    } catch (err) {
      console.error('Failed to initialize protobuf schema', err);
      throw err;
    }
  }

 
  static decode(buffer: Buffer) {
    if (!initialized || !EventMetadataType) {
      throw new AppError(
        'PROTOBUF_NOT_INITIALIZED',
        500,
        'Protobuf schema not initialized'
      );
    }

    const decodedMessage = EventMetadataType.decode(buffer);

    return EventMetadataType.toObject(decodedMessage, {
      longs: Number,
      enums: String,
      defaults: true,
      arrays: true,
      objects: true,
    });
  }
}
