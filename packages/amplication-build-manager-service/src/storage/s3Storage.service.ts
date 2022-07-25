import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';

@Injectable()
export class S3StorageService implements StorageService {
  private readonly storageClient: S3Client;

  constructor() {
    this.storageClient = new S3Client({});
  }

  async saveFile(
    bucket: string,
    filePath: string,
    data: Uint8Array,
  ): Promise<void> {
    const uploadParams: PutObjectCommandInput = {
      Bucket: bucket,
      Key: filePath,
      Body: data,
    };

    await this.storageClient.send(new PutObjectCommand(uploadParams));
  }
}
