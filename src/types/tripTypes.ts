import Long from 'long';

export interface S3RouteFile {
  bucket: string;
  key: string;
  region: string;
}

export type ResponseFormat = 'RAW' | 'POLYLINE';

export interface TripRequest {
  s3UrlListData: S3RouteFile[];
  responseFormat?: ResponseFormat;
}

export interface RoutePoint {
  timeOfDay: string;
  timestampUTC: number;
  latitude: number;
  longitude: number;
  speed?: number;
  bearing?: number;
  accuracy?: number;
  cameraConnectionState?: string;
}

export interface TripPathResponse {
  fullPathAvailable: boolean;
  routePathInfo: RoutePoint[];
  polylinePathInfo?: string;
}

export interface LocationProto {
  timestamp: number | Long;
  latitude: number;
  longitude: number;
  speed: number;
  bearing: number;
  accuracy: number;
  connectionStatus?: number;
}

export interface S3RouteObject {
  bucket: string;
  key: string;
  region: string;
}