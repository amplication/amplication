import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join, normalize } from 'path';
import {
  BUILDS_FOLDER_PATH_ENV_KEY,
  BUILD_OUTPUT_FOLDER,
  DEFAULT_BUILDS_FOLDER,
} from '../../../constants';

@Injectable()
export class BuildPathFactory {
  private readonly buildsFolder: string;
  private readonly outputFolder: string;
  constructor(private readonly configService: ConfigService) {
    // absolute path to the builds folder
    const envFilePath = this.configService.get<string>(
      BUILDS_FOLDER_PATH_ENV_KEY
    );
    this.buildsFolder = envFilePath
      ? normalize(envFilePath)
      : DEFAULT_BUILDS_FOLDER;

    this.outputFolder = this.configService.get<string>(BUILD_OUTPUT_FOLDER)!;
  }

  public get(buildId: string) {
    return join(this.buildsFolder, buildId, this.outputFolder);
  }
}
