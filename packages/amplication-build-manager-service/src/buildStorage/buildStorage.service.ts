import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fsPromises } from 'fs';
import {
  BuildStatusEvent,
  FileLocation,
  GenerateResource,
} from '@amplication/build-types';
import { join } from 'path';
import { timeFormatYearMonthDay } from '../utils/timeFormat';
import { StorageService } from '../storage/storage.service';
import { CompressionService } from '../compression/compression.service';
import { S3_STORAGE_SERVICE } from '../storage/storage.module';

@Injectable()
export class BuildStorageService {
  private readonly BUILD_CONTEXT_S3_BUCKET: string;
  private readonly BUILD_CONTEXT_S3_LOCATION: string;

  private readonly BUILD_ARTIFACT_FS_LOCATION: string;

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
    this.BUILD_ARTIFACT_FS_LOCATION = this.configService.get<string>(
      'BUILD_ARTIFACT_FS_LOCATION',
    );
  }

  public async saveBuildContextSource(
    generateResource: GenerateResource,
  ): Promise<string> {
    try {
      const buffer = await fsPromises.readFile(
        generateResource.contextFileLocation.path,
      );
      const archive = await this.compressionService.createZipArchive([
        { path: 'input-data.json', data: buffer },
      ]);

      const date = timeFormatYearMonthDay(new Date());
      const filePath = join(
        this.BUILD_CONTEXT_S3_LOCATION,
        date,
        generateResource.resourceId,
        `${generateResource.buildId}.zip`,
      );

      await this.storageService.saveFile(
        this.BUILD_CONTEXT_S3_BUCKET,
        filePath,
        archive,
      );

      const path = join(this.BUILD_CONTEXT_S3_BUCKET, filePath);
      return path;
    } catch (err) {
      throw new Error(
        `Failed to save context file in S3 bucket. Input: generateResource: ${generateResource}. Source error: ${err}`,
      );
    }
  }

  public async getBuildArtifact(fileLocation: FileLocation): Promise<Buffer> {
    try {
      const buffer = await this.storageService.getFile(
        fileLocation.bucket,
        fileLocation.path,
      );
      return buffer;
    } catch (err) {
      throw new Error(
        `Failed to get build artifact. Input: fileLocation: ${fileLocation}. Source error: ${err}`,
      );
    }
  }

  public async unpackArtifact(event: BuildStatusEvent): Promise<void> {
    const buffer = await this.getBuildArtifact(event.artifact);
    const files = await this.compressionService.unpackZipArchive(buffer);
    const writeFilePromises = files.map((file) => {
      return fsPromises.writeFile(
        join(this.BUILD_ARTIFACT_FS_LOCATION, event.buildId, file.path),
        file.data,
      );
    });
    await Promise.all(writeFilePromises);
  }
}
