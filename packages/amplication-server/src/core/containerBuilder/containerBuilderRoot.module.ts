import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContainerBuilderModule } from '@amplication/container-builder/dist/nestjs';
import { DockerProvider } from '@amplication/container-builder/dist/docker';
import { CloudBuildProvider } from '@amplication/container-builder/dist/cloud-build';
import { CloudBuildClient } from '@google-cloud/cloudbuild';
import { DockerModule } from '../docker/docker.module';
import { DockerService } from '../docker/docker.service';

export enum ContainerBuilderProvider {
  Docker = 'docker',
  CloudBuild = 'cloud-build'
}

export const CONTAINER_BUILDER_DEFAULT_VAR = 'CONTAINER_BUILDER_DEFAULT';
export const GCP_APPS_PROJECT_ID_VAR = 'GCP_APPS_PROJECT_ID';
export const UNDEFINED_CONTAINER_BUILDER_DEFAULT_ERROR_MESSAGE = `${CONTAINER_BUILDER_DEFAULT_VAR} environment variable must be defined`;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ContainerBuilderRootModule = ContainerBuilderModule.forRootAsync({
  useFactory: (configService: ConfigService, docker: DockerService) => {
    const containerBuilderDefault = configService.get(
      CONTAINER_BUILDER_DEFAULT_VAR
    );
    if (!containerBuilderDefault) {
      throw new Error(UNDEFINED_CONTAINER_BUILDER_DEFAULT_ERROR_MESSAGE);
    }
    const gcpAppsProjectId = configService.get(GCP_APPS_PROJECT_ID_VAR);
    const cloudBuildProvider =
      gcpAppsProjectId &&
      new CloudBuildProvider(new CloudBuildClient(), gcpAppsProjectId);
    return {
      default: containerBuilderDefault,
      providers: {
        [ContainerBuilderProvider.Docker]: new DockerProvider(docker),
        [ContainerBuilderProvider.CloudBuild]: cloudBuildProvider
      }
    };
  },
  inject: [ConfigService, DockerService],
  imports: [ConfigModule, DockerModule]
});
