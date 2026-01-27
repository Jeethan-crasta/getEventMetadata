import { getCameraStatus } from '../../src/utils/cameraStatus';

describe('cameraStatus', () => {
  it('maps connected status correctly', () => {
    expect(getCameraStatus(1)).toBe('CONNECTED');
  });

  it('maps attempting status correctly', () => {
    expect(getCameraStatus(0)).toBe('ATTEMPTING_TO_CONNECT');
  });

  it('maps disconnected status correctly', () => {
    expect(getCameraStatus(-1)).toBe('DISCONNECTED');
  });

  it('returns UNKNOWN for invalid status', () => {
    expect(getCameraStatus(99)).toBe('UNKNOWN');
  });
});
