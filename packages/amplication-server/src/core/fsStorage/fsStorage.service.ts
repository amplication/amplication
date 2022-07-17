import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import { StorageService } from 'src/services/storage.service';

export const FS_STORAGE_SERVICE = 'FS_STORAGE_SERVICE';

@Injectable()
export class FsStorageService implements StorageService {
  public async saveFile(filePath: string, data: string): Promise<void> {
    const dirname = path.dirname(filePath);
    await fs.promises.mkdir(dirname, { recursive: true });
    return fs.promises.writeFile(filePath, data);
  }
}
