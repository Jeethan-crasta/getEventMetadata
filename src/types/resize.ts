export interface ResizeRequest {
  source: {
    bucket: string;
    key: string;
    region: string;
  };
  target: {
    bucket: string;
    key: string;
    region: string;
    width: number;
  };
}

export interface ImageObject {
  body: Buffer;
  metadata: Record<string, string>;
  contentType?: string;
  contentLength?: number;
}