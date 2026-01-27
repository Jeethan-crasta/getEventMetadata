import protobuf from 'protobufjs';
import path from 'path';
import { AppError } from '../errors/AppError';

export class ProtobufLoader {
  private static eventMetadataType: protobuf.Type;
  private static routeLocationType: protobuf.Type;
  private static initPromise: Promise<void> | null = null;

  static async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        const eventMetadataPath = path.join(
          __dirname,
          '..',
          'proto',
          'EventMetadata.proto'
        );

        const eventRoot = await protobuf.load(eventMetadataPath);
        const eventType = eventRoot.lookupType('EventMetadata');

        if (!eventType) {
          throw new Error('EventMetadata type not found');
        }

        this.eventMetadataType = eventType;

        const routeProtoPath = path.join(
          __dirname,
          '..',
          'proto',
          'route.proto'
        );

        const routeRoot = await protobuf.load(routeProtoPath);
        const locationType = routeRoot.lookupType(
          'lightmetricspackage.Location'
        );

        if (!locationType) {
          throw new Error('Location type not found in route.proto');
        }

        this.routeLocationType = locationType;
      } catch (err) {
        throw new AppError(
          'Failed to initialize protobuf schemas',
          500,
          'PROTOBUF_INIT_FAILED',
          err
        );
      }
    })();

    return this.initPromise;
  }

  static getEventMetadataType(): protobuf.Type {
    if (!this.eventMetadataType) {
      throw new AppError(
        'ProtobufLoader.init() was not called',
        500,
        'PROTOBUF_NOT_INITIALIZED'
      );
    }

    return this.eventMetadataType;
  }

  static getRouteLocationType(): protobuf.Type {
    if (!this.routeLocationType) {
      throw new AppError(
        'ProtobufLoader.init() was not called',
        500,
        'PROTOBUF_NOT_INITIALIZED'
      );
    }

    return this.routeLocationType;
  }
}
