import { ConfigModule, ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { CloudBuildClient } from '@google-cloud/cloudbuild';
import Docker from 'dockerode';
import { DeployerModule } from 'amplication-deployer/dist/nestjs';
import { DockerProvider } from 'amplication-deployer/dist/docker';
import { GCPProvider } from 'amplication-deployer/dist/gcp';

export enum DeployerProvider {
  Docker = 'docker',
  GCP = 'gcp'
}

export const DEPLOYER_DEFAULT_VAR = 'DEPLOYER_DEFAULT';
export const APPS_GCP_PROJECT_ID_VAR = 'APPS_GCP_PROJECT_ID';
export const GCS_BUCKET_VAR = 'GCS_BUCKET';
export const UNDEFINED_DEPLOYER_DEFAULT_ERROR_MESSAGE = `${DEPLOYER_DEFAULT_VAR} environment variable must be defined`;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const DeployerRootModule = DeployerModule.forRootAsync({
  useFactory: (configService: ConfigService) => {
    const deployerDefault = configService.get(DEPLOYER_DEFAULT_VAR);
    if (!deployerDefault) {
      throw new Error(UNDEFINED_DEPLOYER_DEFAULT_ERROR_MESSAGE);
    }
    const appsGCPProjectId = configService.get(APPS_GCP_PROJECT_ID_VAR);
    const bucket = configService.get(GCS_BUCKET_VAR);
    const gcpProvider =
      appsGCPProjectId &&
      new GCPProvider(
        new CloudBuildClient(),
        new Storage(),
        appsGCPProjectId,
        /** @todo prefix results */
        bucket
      );
    return {
      default: deployerDefault,
      providers: {
        [DeployerProvider.Docker]: new DockerProvider(new Docker()),
        [DeployerProvider.GCP]: gcpProvider
      }
    };
  },
  inject: [ConfigService],
  imports: [ConfigModule]
});
