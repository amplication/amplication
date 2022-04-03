import { Module } from '@amplication/data-service-generator';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { outputFile, remove } from 'fs-extra';
import { tmpdir } from 'os';
import { join } from 'path';
import { BASE_BUILDS_FOLDER } from 'src/constants';
import { AmplicationError } from 'src/errors/AmplicationError';

const savingErrorMessage =
  'There was a error in saving the generated files to the amplication file system';

@Injectable()
export class BuildFilesSaver {
  private baseBuildsPath: string;

  constructor(configService: ConfigService) {
    const envFilePath = configService.get<string>(BASE_BUILDS_FOLDER);
    this.baseBuildsPath = join(envFilePath ? envFilePath : tmpdir(), 'builds');
  }
  async saveFiles(relativePath: string, modules: Module[]): Promise<void> {
    try {
      const filesPromises = modules.map(async (module, i) => {
        const filePath = join(this.baseBuildsPath, relativePath, module.path);
        return outputFile(filePath, module.code);
      });
      await Promise.all(filesPromises);
    } catch (error) {
      await remove(join(this.baseBuildsPath, relativePath));
      throw new AmplicationError(savingErrorMessage);
    }
  }
}
