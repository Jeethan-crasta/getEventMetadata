import { extractAnnotationsMetadata } from '../../src/Extractor/annotationsExtractor';
import { AppError } from '../../src/errors/AppError';

describe('annotationsExtractor', () => {
  it('extracts annotations metadata', () => {
    const message = {
      aiMetaData: [
        { type: 'EVENT', value: 'start', timestamp: 1 },
        { type: 'EVENT', value: 'stop', timestamp: 2 },
      ],
    };

    const result = extractAnnotationsMetadata(message as any);

    expect(result.length).toBe(2);
    expect(result[0].timestampUTC).toBe(1);
  });

  it('throws AppError when aiMetaData is missing', () => {
    expect(() =>
      extractAnnotationsMetadata({} as any)
    ).toThrow(AppError);
  });
});
