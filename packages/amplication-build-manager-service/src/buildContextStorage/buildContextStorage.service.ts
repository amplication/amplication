import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { promises as fsPr } from 'fs';
import { GenerateResource } from 'src/codeBuild/dto/GenerateResource';
import JSZip from 'jszip';
import { join } from 'path';

@Injectable()
export class BuildContextStorageService {
  private readonly client: S3Client;
  private readonly BUILD_CONTEXT_S3_BUCKET: string;
  private readonly BUILD_CONTEXT_S3_LOCATION: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: configService.get('AWS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_KEY'),
      },
    });
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
    const buffer = await fsPr.readFile(genResource.contextFileLocation.path);

    const zipper = new JSZip();
    zipper.file('input-data.json', buffer);
    const archive = await zipper.generateAsync({ type: 'uint8array' });

    const date = new Date().toISOString().split('T')[0];
    const key = join(
      this.BUILD_CONTEXT_S3_LOCATION,
      date,
      genResource.projectId,
      genResource.resourceId,
      `${genResource.buildId}.zip`,
    );

    const uploadParams: PutObjectCommandInput = {
      Bucket: this.BUILD_CONTEXT_S3_BUCKET,
      Key: key,
      Body: archive,
    };

    await this.client.send(new PutObjectCommand(uploadParams));

    const path = join(this.BUILD_CONTEXT_S3_BUCKET, key);
    return path;
  }
}
