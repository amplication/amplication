import {
  readdirSync,
} from 'fs';
import { StorageProvider } from './storage-provider.interface';

export class FsStorageProvider implements StorageProvider {
  public getSubDirectories(path: string): string[] {
    return readdirSync(path, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((value) => value.name);
  }

  public directoryContains(path: string, files: string[]): boolean {
    return readdirSync(path, { withFileTypes: true })
      .filter((dirent) => dirent.isFile())
      .some((file) => files.includes(file.name));
  }
}
