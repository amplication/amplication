import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudBuildClient } from '@google-cloud/cloudbuild';
import { Storage } from '@google-cloud/storage';
import { GCPProvider } from '@amplication/deployer/dist/gcp';

export const GCP_APPS_PROJECT_ID_VAR = 'GCP_APPS_PROJECT_ID';
export const GCS_BUCKET_VAR = 'GCS_BUCKET';

@Injectable()
export class GCPProviderService {
  constructor(private readonly configService: ConfigService) {}
  getProvider(): GCPProvider | null {
    const gcpAppsProjectId = this.configService.get(GCP_APPS_PROJECT_ID_VAR);
    if (!gcpAppsProjectId) {
      return null;
    }
    const bucket = this.configService.get(GCS_BUCKET_VAR);
    return new GCPProvider(
      new CloudBuildClient(),
      new Storage(),
      gcpAppsProjectId,
      /** @todo prefix results */
      bucket
    );
  }
}
