import { extractPathInfo } from '../../src/Extractor/pathExtractor';
import { AppError } from '../../src/errors/AppError';

describe('pathExtractor', () => {
  it('extracts path information', () => {
    const message = {
      locationData: [
        {
          timestamp: 1000,
          latitude: 1,
          longitude: 2,
          speed: 30,
          bearing: 90,
          accuracy: 5,
          connectionStatus: 1,
        },
      ],
    };

    const result = extractPathInfo(message as any);

    expect(result.routePathInfo.length).toBe(1);
    expect(result.routePathInfo[0].latitude).toBe(1);
  });

  it('throws AppError when locationData is missing', () => {
    expect(() =>
      extractPathInfo({} as any)
    ).toThrow(AppError);
  });
});
