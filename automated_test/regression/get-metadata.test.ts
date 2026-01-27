import axios from 'axios';
import input from '../fixtures/get-metadata/input.json';
import expected from '../fixtures/get-metadata/expected.json';
import { normalizeCommon, normalizeArray } from '../utils/normalize';

describe('GET METADATA – Regression', () => {
  it('should return same metadata for same input', async () => {
    const res = await axios.post(
      'http://localhost:3000/v1/lambda/event_metadata',
      input
    );

    expect(res.status).toBe(200);

    const actual = normalizeCommon(res.data);

    actual.accelerometerData = normalizeArray(
      actual.accelerometerData,
      ['timestampUTC', 'timeOfDay']
    );

    const expectedNorm = normalizeCommon(expected);
    expectedNorm.accelerometerData = normalizeArray(
      expectedNorm.accelerometerData,
      ['timestampUTC', 'timeOfDay']
    );

    expect(actual).toEqual(expectedNorm);
  });
});
