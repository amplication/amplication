import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { FsStorageService } from '../fsStorage/fsStorage.service';
import { BuildContext } from './dto/BuildContext';

@Injectable()
export class BuildContextStorageService {

  private readonly buildContextLocation: string;

  constructor(
    private readonly fsStorageService: FsStorageService,
    private readonly configService: ConfigService
  ) {
    this.buildContextLocation = this.configService.get('BUILD_CONTEXT_LOCATION');
  }

  public async saveBuildContext(buildContext: BuildContext): Promise<string> {
    const date = new Date().toISOString().split('T')[0];
    const path = join(
      this.buildContextLocation,
      date,
      buildContext.projectId,
      buildContext.resourceId,
      `${buildContext.buildId}.json`
    );
    await this.fsStorageService.saveFile(path, JSON.stringify(buildContext));
    return path;
  }
}
