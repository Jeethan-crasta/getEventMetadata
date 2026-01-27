export interface Timestamped {
  timestamp: number | string;
}

export interface RawAccelerometerSample extends Timestamped {
  x: number;
  y: number;
  z: number;
  globalAccForward: number;
  globalAccLateral: number;
  filteredGlobalAccForward: number;
  filteredGlobalAccLateral: number;
  speed?: number;
}


export interface AccelerometerAxes {
  x: number;
  y: number;
  z: number;
}

export interface ProcessedAccelerometerData {
  timeOfDay: string;
  timestampUTC: number;
  axes: AccelerometerAxes;
}

export interface RawAccelerometerData extends ProcessedAccelerometerData {
  globalAccForward: number;
  globalAccLateral: number;
  speed?: number;
  globalGravity: number;
}


export interface AnnotationMetadata extends Timestamped {
  [key: string]: unknown;
}


export interface EventMetadataResult {
  timestampUTC: number;
  [key: string]: unknown;
}


export interface LocationSample extends Timestamped {
  latitude: number;
  longitude: number;
  speed: number;
  bearing: number;
  accuracy: number;
  connectionStatus: number;
}

export interface RoutePathPoint {
  timeOfDay: string;
  timestampUTC: number;
  latitude: number;
  longitude: number;
  speed: number;
  bearing: number;
  accuracy: number;
  cameraConnectionState: string;
}

export interface PathInfoResult {
  routePathInfo: RoutePathPoint[];
}

export interface EventMetadataMessage {
  accData?: RawAccelerometerSample[];
  aiMetaData?: AnnotationMetadata[];
  locationData?: LocationSample[];
}