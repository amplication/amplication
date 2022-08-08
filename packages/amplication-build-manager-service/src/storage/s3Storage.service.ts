import {
  GetObjectCommand,
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

  async getFile(bucket: string, location: string): Promise<Buffer> {
    const params = {
      Bucket: bucket,
      Key: location,
    };

    const goc = new GetObjectCommand(params);
    const data = await this.storageClient.send(goc);

    const bodyContents = await this.streamToBuffer(data.Body);
    return bodyContents;
  }

  private streamToBuffer(stream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}
