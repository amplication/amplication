import { Module } from '@amplication/data-service-generator';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import assert from 'assert';
import { outputFile, remove } from 'fs-extra';
import { join, normalize } from 'path';
import { BASE_BUILDS_FOLDER } from 'src/constants';
import { AmplicationError } from 'src/errors/AmplicationError';
import { Logger } from 'winston';
@Injectable()
export class BuildFilesSaver {
  private baseBuildsPath: string;
  constructor(configService: ConfigService, logger: Logger) {
    const envFilePath = configService.get<string>(BASE_BUILDS_FOLDER);
    assert(envFilePath);
    this.baseBuildsPath = normalize(envFilePath);
    logger.info(`The BASE_BUILDS_FOLDER value is ${envFilePath}`);
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
      throw new AmplicationError(
        'There was a error in saving the generated files to the amplication file system'
      );
    }
  }
}
