export function getCameraStatus(connectionStatus?: number): string {
  if (connectionStatus === 1) return 'CONNECTED';
  if (connectionStatus === 0) return 'ATTEMPTING_TO_CONNECT';
  if (connectionStatus === -1) return 'DISCONNECTED';
  return 'UNKNOWN';
}
