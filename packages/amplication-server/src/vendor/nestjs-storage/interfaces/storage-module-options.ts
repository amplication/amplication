import { StorageManagerConfig } from '@slynova/flydrive';
import {
  DiskConfigType,
  DiskGCSConfigType,
  DiskLocalConfigType,
  DiskS3ConfigType,
  DriverType,
  DiskType,
} from '../types';

export interface StorageModuleOptions extends StorageManagerConfig {
  default: string;
  disks: Record<string, DiskType>;
}

export interface StorageDiskConfig {
  driver: DriverType | string;
  config: DiskConfigType;
}

export interface AwsS3StorageDisk extends StorageDiskConfig {
  driver: DriverType.S3 | 's3';
  config: DiskS3ConfigType;
}

export interface LocalStorageDisk extends StorageDiskConfig {
  driver: DriverType.LOCAL | 'local';
  config: DiskLocalConfigType;
}

export interface GoogleGcsStorageDisk extends StorageDiskConfig {
  driver: DriverType.GCS | 'gcs';
  config: DiskGCSConfigType;
}
