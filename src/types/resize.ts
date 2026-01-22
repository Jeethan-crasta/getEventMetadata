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
