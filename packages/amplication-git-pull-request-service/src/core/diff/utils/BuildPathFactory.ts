import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join, normalize } from 'path';
import {
  BUILDS_FOLDER_PATH_ENV_KEY,
  DEFAULT_BUILDS_FOLDER,
} from '../../../constants';

@Injectable()
export class BuildPathFactory {
  private readonly buildsFolder: string;
  constructor(private readonly configService: ConfigService) {
    // absolute path to the builds folder
    const envFilePath = this.configService.get<string>(
      BUILDS_FOLDER_PATH_ENV_KEY
    );
    this.buildsFolder = envFilePath
      ? normalize(envFilePath)
      : DEFAULT_BUILDS_FOLDER;
  }
  private appPath(amplicationAppId: string) {
    return join(this.buildsFolder, amplicationAppId);
  }
  public get(appId: string, buildId: string) {
    return join(this.appPath(appId), buildId);
  }
}
