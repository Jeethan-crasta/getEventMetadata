export type CameraStatus =
  | 'CONNECTED'
  | 'ATTEMPTING_TO_CONNECT'
  | 'DISCONNECTED'
  | 'UNKNOWN';

export function mapCameraStatus(status: number): CameraStatus {
  switch (status) {
    case 1:
      return 'CONNECTED';
    case 0:
      return 'ATTEMPTING_TO_CONNECT';
    case -1:
      return 'DISCONNECTED';
    default:
      return 'UNKNOWN';
  }
}
