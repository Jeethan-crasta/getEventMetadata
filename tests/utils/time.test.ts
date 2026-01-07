import { describe, it, expect } from 'vitest';
import { formatTimeUTC } from '../../src/utils/time';
import { AppError } from '../../src/errors/AppError';

describe('formatTimeUTC', () => {
  it('formats timestamp as HH:mm:ss UTC', () => {
    const ts = Date.UTC(2024, 0, 1, 10, 5, 30);
    expect(formatTimeUTC(ts)).toBe('10:05:30');
  });

  it('throws AppError for invalid timestamp', () => {
    expect(() => formatTimeUTC(NaN)).toThrow(AppError);
  });
});
