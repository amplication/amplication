import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DSGResourceData } from '@amplication/code-gen-types';

import { promises as fs } from 'fs';
import fse from 'fs-extra';
import { join, dirname } from 'path';
import { Env } from '../env';

@Injectable()
export class BuildRunnerService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  getHello(): string {
    return 'Hello World!';
  }

  async saveDsgResourceData(buildId: string, dsgResourceData: DSGResourceData) {
    const savePath = join(
      this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
      buildId,
      this.configService.get(Env.DSG_JOBS_RESOURCE_DATA_FILE),
    );

    const saveDir = dirname(savePath);
    await fs.mkdir(saveDir, { recursive: true });

    await fs.writeFile(savePath, JSON.stringify(dsgResourceData));
  }

  async copyFromJobToArtifact(buildId: string) {
    const jobPath = join(
      this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
      buildId,
      this.configService.get(Env.DSG_JOBS_CODE_FOLDER),
    );

    const artifactPath = join(
      this.configService.get(Env.BUILD_ARTIFACTS_BASE_FOLDER),
      buildId,
      this.configService.get(Env.BUILD_ARTIFACTS_CODE_FOLDER),
    );

    await fse.copy(jobPath, artifactPath);
  }
}
