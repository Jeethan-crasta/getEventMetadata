import { getTimeOfDay } from '../../src/utils/time';

describe('time utils', () => {
  it('formats UTC time correctly', () => {
    const timestamp = Date.UTC(2020, 0, 1, 0, 0, 0);
    const result = getTimeOfDay(timestamp);
    expect(['00:00:00', '24:00:00']).toContain(result);
  });
});
