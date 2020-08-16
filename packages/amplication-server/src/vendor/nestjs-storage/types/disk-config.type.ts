export type DiskConfigType =
  | DiskLocalConfigType
  | DiskS3ConfigType
  | DiskGCSConfigType
  | Record<string, any>;

export type DiskLocalConfigType = {
  root: string;
};

export type DiskS3ConfigType = {
  key: string;
  endpoint: string;
  secret: string;
  bucket: string;
  region: string;
};

export type DiskGCSConfigType = {
  keyFilename: string;
  bucket: string;
};
