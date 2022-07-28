import { StorageTypeEnum } from './StorageTypeEnum';

export interface FileLocation {
  storageType: StorageTypeEnum;
  bucket?: string;
  path: string;
}
