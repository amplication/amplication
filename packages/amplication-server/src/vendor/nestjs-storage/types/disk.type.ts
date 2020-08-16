import {
  AwsS3StorageDisk,
  GoogleGcsStorageDisk,
  LocalStorageDisk,
  StorageDiskConfig,
} from '../interfaces';

export type DiskType =
  | AwsS3StorageDisk
  | LocalStorageDisk
  | GoogleGcsStorageDisk
  | StorageDiskConfig;
