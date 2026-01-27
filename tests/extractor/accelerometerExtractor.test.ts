import { extractAccelerometerData } from '../../src/Extractor/accelerometerExtractor';
import { AppError } from '../../src/errors/AppError';

describe('accelerometerExtractor', () => {
  it('extracts accelerometer data', () => {
    const message = {
      accData: [
        {
          timestamp: 1000,
          x: 1,
          y: 2,
          z: 3,
          globalAccForward: 0,
          globalAccLateral: 0,
          filteredGlobalAccForward: 0.5,
          filteredGlobalAccLateral: 0.6,
          speed: 10,
        },
      ],
    };

    const result = extractAccelerometerData(message as any);
    expect(result.length).toBe(1);
    expect(result[0].timestampUTC).toBe(1000);
  });

  it('throws AppError when accData is missing', () => {
    expect(() =>
      extractAccelerometerData({} as any)
    ).toThrow(AppError);
  });
});
