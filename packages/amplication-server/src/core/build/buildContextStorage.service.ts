import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { StorageService } from 'src/services/storage.service';
import { FS_STORAGE_SERVICE } from '../fsStorage/fsStorage.service';
import { BuildContext } from './dto/BuildContext';

@Injectable()
export class BuildContextStorageService {
  private readonly buildContextLocation: string;

  constructor(
    @Inject(FS_STORAGE_SERVICE)
    private readonly storageService: StorageService,
    private readonly configService: ConfigService
  ) {
    this.buildContextLocation = this.configService.get(
      'BUILD_CONTEXT_LOCATION'
    );
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
    await this.storageService.saveFile(path, JSON.stringify(buildContext));
    return path;
  }
}
