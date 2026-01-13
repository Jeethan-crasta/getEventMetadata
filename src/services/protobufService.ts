// services/protobufService.ts
import protobuf from 'protobufjs';
import path from 'path';
import { AppError } from '../errors/AppError';

export class ProtobufService {
  private static eventMetadataType: protobuf.Type;
  private static initPromise: Promise<void> | null = null;

  static init(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        const protoPath = path.join(
          __dirname,'..','schema','EventMetadata.proto'
        );

        const root = await protobuf.load(protoPath);
        const type = root.lookupType('EventMetadata');

        if (!type) {
          throw new Error('EventMetadata type not found');
        }

        this.eventMetadataType = type;
      } catch (err) {
        throw new AppError(
          'PROTOBUF_INIT_FAILED',
          500,
          'Failed to initialize protobuf schema',
          err
        );
      }
    })();

    return this.initPromise;
  }

  static decode(buffer: Buffer) {
    if (!this.eventMetadataType) {
      throw new AppError(
        'PROTOBUF_NOT_INITIALIZED',
        500,
        'ProtobufService.init() was not called'
      );
    }

    const decoded = this.eventMetadataType.decode(buffer);

    return this.eventMetadataType.toObject(decoded, {
      longs: Number,
      enums: String,
      defaults: true,
      arrays: true,
      objects: true,
    });
  }
}
