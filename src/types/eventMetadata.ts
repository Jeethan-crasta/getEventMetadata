export interface EventMetadataOptions {
  includeInertialSensorData?: boolean;
  includeRawInertialSensorData?: boolean;
  includeAnnotationsMetadata?: boolean;
  includePathInfo?: boolean;
}

export interface EventMetadataRequest {
  bucket: string;
  url: string;
  region: string;
  videoStartTimeUTC?: number;
  videoEndTimeUTC?: number;
  options?: Readonly<EventMetadataOptions>;
}
