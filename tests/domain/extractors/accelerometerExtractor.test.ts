import { describe, it, expect } from 'vitest';
import { extractAccelerometerData } from '../../../src/domain/extractors/accelerometerExtractor';
import { AppError } from '../../../src/errors/AppError';

describe('extractAccelerometerData', () => {
  it('throws if accData is missing', () => {
    expect(() =>
      extractAccelerometerData({} as any)
    ).toThrow(AppError);
  });

  it('matches lambda time filtering behavior', () => {
    const message = {
      accData: [
        { timestamp: 100, x: 1, y: 1, z: 1 },
        { timestamp: 200, x: 1, y: 1, z: 1 },
      ],
    };

    const result = extractAccelerometerData(
      message as any,
      0,
      0,
      false
    );

    expect(result).toHaveLength(2);
  });
});
