import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { FsStorageService } from '../fsStorage/fsStorage.service';
import { BuildContext } from './dto/BuildContext';

@Injectable()
export class BuildContextStorageService {
  constructor(
    private readonly fsStorageService: FsStorageService,
    private readonly configService: ConfigService
  ) {}

  public async saveBuildContext(buildContext: BuildContext): Promise<string> {
    const root = this.configService.get('BUILD_CONTEXT_LOCATION');
    const date = new Date().toISOString().split('T')[0];
    const path = join(
      root,
      date,
      buildContext.projectId,
      buildContext.resourceId,
      `${buildContext.buildId}.json`
    );
    await this.fsStorageService.saveFile(path, JSON.stringify(buildContext));
    return path;
  }
}
