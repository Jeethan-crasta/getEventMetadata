import { processEventMetadata } from '../../src/services/eventMetadataService';
import * as s3Adapters from '../../src/aws/s3Adapters';
import * as accelerometerExtractor from '../../src/Extractor/accelerometerExtractor';
import * as protobufLoader from '../../src/utils/protobufLoader';

jest.spyOn(s3Adapters, 'getEventPayloadBuffer')
  .mockResolvedValue(Buffer.from([1, 2, 3]));

jest.spyOn(protobufLoader.ProtobufLoader, 'getEventMetadataType')
  .mockReturnValue({
    decode: jest.fn().mockReturnValue({}),
    toObject: jest.fn().mockReturnValue({}),
  } as any);

jest.spyOn(accelerometerExtractor, 'extractAccelerometerData')
  .mockReturnValue([
    {
      timestampUTC: 0,
      xAcceleration: 1,
      yAcceleration: 2,
      zAcceleration: 3,
    },
  ] as any);


describe('processEventMetadata', () => {
  it('returns accelerometer data when enabled', async () => {
    const result = await processEventMetadata({
      bucket: 'test',
      url: 'file.pbf',
      region: 'us-east-1',
      videoStartTimeUTC: 0,
      videoEndTimeUTC: 1,
      options: {
        includeInertialSensorData: true,
      },
    });

    expect(result.accelerometerData).toBeDefined();
  });

  it('throws when S3 fetch fails', async () => {
    (s3Adapters.getEventPayloadBuffer as jest.Mock).mockRejectedValueOnce(
      new Error('fail')
    );

    await expect(
      processEventMetadata({
        bucket: 'test',
        url: 'file.pbf',
        region: 'us-east-1',
      })
    ).rejects.toThrow();
  });
});
