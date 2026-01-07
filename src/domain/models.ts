/**
 * ===== Accelerometer / Inertial Models =====
 */

export interface AccelerometerAxes {
  x: number;
  y: number;
  z: number;
}

export interface ProcessedAccelerometerSample {
  timeOfDay: string;
  timestampUTC: number;
  axes: AccelerometerAxes;
}

export interface RawAccelerometerSample extends ProcessedAccelerometerSample {
  globalAccForward: number;
  globalAccLateral: number;
  speed?: number;
  globalGravity: number;
}

export type AccelerometerSample =
  | ProcessedAccelerometerSample
  | RawAccelerometerSample;

/**
 * ===== Annotation Models =====
 */

export interface AnnotationMetadata {
  timestampUTC: number;
  [key: string]: unknown; // keeps schema flexible
}

/**
 * ===== Path / Location Models =====
 */

export type CameraConnectionState =
  | 'CONNECTED'
  | 'ATTEMPTING_TO_CONNECT'
  | 'DISCONNECTED'
  | 'UNKNOWN';

export interface RoutePathPoint {
  timeOfDay: string;
  timestampUTC: number;
  latitude: number;
  longitude: number;
  speed?: number;
  bearing?: number;
  accuracy?: number;
  cameraConnectionState: CameraConnectionState;
}

export interface PathInfo {
  routePathInfo: RoutePathPoint[];
}

/**
 * ===== Aggregate Output Model =====
 */

export interface EventMetadataResult {
  accelerometerData?: AccelerometerSample[];
  annotationsMetadata?: AnnotationMetadata[];
  pathInfo?: PathInfo;
}
