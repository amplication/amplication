import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fsPr } from 'fs';
import { GenerateResource } from '../codeBuild/dto/GenerateResource';
import { join } from 'path';
import { timeFormatYearMonthDay } from '../utils/timeFormat';
import { StorageService } from '../storage/storage.service';
import { CompressionService } from '../compression/compression.service';
import { S3_STORAGE_SERVICE } from '../storage/storage.module';

@Injectable()
export class BuildContextStorageService {
  private readonly BUILD_CONTEXT_S3_BUCKET: string;
  private readonly BUILD_CONTEXT_S3_LOCATION: string;

  constructor(
    @Inject(S3_STORAGE_SERVICE) private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    private readonly compressionService: CompressionService,
  ) {
    this.BUILD_CONTEXT_S3_BUCKET = this.configService.get<string>(
      'BUILD_CONTEXT_S3_BUCKET',
    );
    this.BUILD_CONTEXT_S3_LOCATION = this.configService.get<string>(
      'BUILD_CONTEXT_S3_LOCATION',
    );
  }

  public async saveBuildContextSource(
    genResource: GenerateResource,
  ): Promise<string> {
    try {
      const buffer = await fsPr.readFile(genResource.contextFileLocation.path);
      const archive = await this.compressionService.createZipArchive([
        { path: 'input-data.json', data: buffer },
      ]);

      const date = timeFormatYearMonthDay(new Date());
      const key = join(
        this.BUILD_CONTEXT_S3_LOCATION,
        date,
        genResource.projectId,
        genResource.resourceId,
        `${genResource.buildId}.zip`,
      );

      await this.storageService.saveFile(
        this.BUILD_CONTEXT_S3_BUCKET,
        key,
        archive,
      );

      const path = join(this.BUILD_CONTEXT_S3_BUCKET, key);
      return path;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
