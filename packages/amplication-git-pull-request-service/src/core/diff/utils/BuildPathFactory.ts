import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import assert from 'assert';
import { join, normalize } from 'path';
import { BUILDS_FOLDER_PATH_ENV_KEY } from 'src/constants';

@Injectable()
export class BuildPathFactory {
  private readonly buildsFolder: string;
  constructor(private readonly configService: ConfigService) {
    // absolute path to the builds folder
    const envFilePath = this.configService.get<string>(
      BUILDS_FOLDER_PATH_ENV_KEY
    );
    assert(envFilePath);
    this.buildsFolder = normalize(envFilePath);
  }
  private resourcePath(resourceId: string) {
    return join(this.buildsFolder, resourceId);
  }
  public get(resourceId: string, buildId: string) {
    return join(this.resourcePath(resourceId), buildId);
  }
}
