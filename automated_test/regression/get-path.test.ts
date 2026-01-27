import axios from 'axios';
import input from '../fixtures/get-path/input.json';
import expected from '../fixtures/get-path/expected.json';
import { normalizeCommon, normalizeArray } from '../utils/normalize';

describe('GET PATH – Regression', () => {
  it('should return identical path response for same input', async () => {
    const res = await axios.post(
      'http://localhost:3000/v1/lambda/get_path',
      input
    );

    expect(res.status).toBe(200);

    // normalize actual
    const actual = normalizeCommon(res.data);
    actual.routePathInfo = normalizeArray(
      actual.routePathInfo,
      ['timestampUTC', 'timeOfDay']
    );

    // normalize expected
    const expectedNorm = normalizeCommon(expected);
    expectedNorm.routePathInfo = normalizeArray(
      expectedNorm.routePathInfo,
      ['timestampUTC', 'timeOfDay']
    );

    expect(actual).toEqual(expectedNorm);
  });
});
