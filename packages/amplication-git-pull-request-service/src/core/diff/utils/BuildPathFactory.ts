import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join, normalize } from 'path';
import {
  DEFAULT_BUILDS_FOLDER,
} from '../../../constants';
import { Env } from '../../../env';

@Injectable()
export class BuildPathFactory {
  private readonly buildsFolder: string;
  private readonly outputFolder: string;
  constructor(private readonly configService: ConfigService) {
    // absolute path to the builds folder
    const envFilePath = this.configService.get<string>(Env.BASE_BUILDS_FOLDER);
    this.buildsFolder = envFilePath
      ? normalize(envFilePath)
      : DEFAULT_BUILDS_FOLDER;

    this.outputFolder = this.configService.get<string>(Env.BUILD_OUTPUT_FOLDER)!;
  }

  public get(buildId: string) {
    return join(this.buildsFolder, buildId, this.outputFolder);
  }
}
