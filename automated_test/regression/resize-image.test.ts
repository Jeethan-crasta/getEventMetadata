import axios from 'axios';
import input from '../fixtures/resize-image/input.json';
import expected from '../fixtures/resize-image/expected.json';
import { normalizeCommon } from '../utils/normalize';

describe('RESIZE IMAGE – Regression', () => {
  it('should resize image and return success response', async () => {
    const res = await axios.post(
      'http://localhost:3000/v1/lambda/resize',
      input
    );

    expect(res.status).toBe(200);

    expect(
      normalizeCommon(res.data)
    ).toEqual(
      normalizeCommon(expected)
    );
  });
});
