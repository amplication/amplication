import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

@Injectable()
export class FsStorageService {
    
    public async saveFile(filePath: string, data: string): Promise<void> {
        const dirname = path.dirname(filePath);
        await fs.promises.mkdir(dirname, { recursive: true });
        return fs.promises.writeFile(filePath, data);
    }
}