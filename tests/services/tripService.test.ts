import { getTripPath } from '../../src/services/tripService';
import * as s3Adapters from '../../src/aws/s3Adapters';
import * as decoder from '../../src/decoders/binary.decoder';
import { deflateSync } from 'zlib';

jest.spyOn(s3Adapters, 'getObjectWithMetadata').mockResolvedValue({
  body: deflateSync(Buffer.from('route')),
  metadata: { routefileversion: '1' },
});

jest.spyOn(decoder, 'decodeBinaryRoute').mockReturnValue([
  {
    timeOfDay: '00:00:00',
    timestampUTC: 0,
    latitude: 1,
    longitude: 2,
    speed: 0,
    bearing: 0,
    accuracy: 0,
    cameraConnectionState: 'CONNECTED',
  },
]);


describe('tripService', () => {
  it('returns route path info', async () => {
    const result = await getTripPath({
      s3UrlListData: [
        { bucket: 'b', key: 'k', region: 'r' },
      ],
      responseFormat: 'RAW',
    });

    expect(result.routePathInfo.length).toBe(1);
  });

  it('throws when route file is empty', async () => {
    (s3Adapters.getObjectWithMetadata as jest.Mock).mockResolvedValueOnce({
      body: undefined,
    });

    await expect(
      getTripPath({
        s3UrlListData: [
          { bucket: 'b', key: 'k', region: 'r' },
        ],
        responseFormat: 'RAW',
      })
    ).rejects.toThrow();
  });
});
