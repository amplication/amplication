import { Module } from '@amplication/data-service-generator';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { outputFile } from 'fs-extra';
import { tmpdir } from 'os';
import { join } from 'path';
import { BASE_BUILDS_FOLDER } from 'src/constants';

@Injectable()
export class BuildFilesSaver {
  private baseBuildsPath: string;

  constructor(configService: ConfigService) {
    const envFilePath = configService.get<string>(BASE_BUILDS_FOLDER);
    this.baseBuildsPath = join(envFilePath ? envFilePath : tmpdir(), 'builds');
  }
  async saveFiles(
    appId: string,
    buildId: string,
    modules: Module[]
  ): Promise<void> {
    const folder = join(this.baseBuildsPath, appId, buildId);
    const filesPromises = modules.map(async (module, i) => {
      const filePath = join(folder, module.path);
      return outputFile(filePath, module.code);
    });
    await Promise.all(filesPromises);
  }
}
