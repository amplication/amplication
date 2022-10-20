import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DSGResourceData } from '@amplication/code-gen-types';

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { Env } from '../env';

@Injectable()
export class BuildRunnerService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  getHello(): string {
    return 'Hello World!';
  }

  async saveDsgResourceData(buildId: string, dsgResourceData: DSGResourceData) {
    console.log(
      'saveDsgResourceData',
      '\nbuildId: ',
      buildId,
      '\nbaseBuildFolder: ',
      this.configService.get(Env.BASE_BUILDS_FOLDER),
      '\nresourceDataFileName: ',
      this.configService.get(Env.RESOURCE_DATA_FILE_NAME),
    );

    const savePath = join(
      this.configService.get(Env.BASE_BUILDS_FOLDER),
      buildId,
      this.configService.get(Env.RESOURCE_DATA_FILE_NAME)
    );

    const saveDir = dirname(savePath);
    await fs.mkdir(saveDir, { recursive: true });

    await fs.writeFile(savePath, JSON.stringify(dsgResourceData));
  }
}
