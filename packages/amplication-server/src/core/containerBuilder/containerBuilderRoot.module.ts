import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContainerBuilderModule } from 'amplication-container-builder/dist/nestjs';
import { DockerProvider } from 'amplication-container-builder/dist/docker';
import { CloudBuildProvider } from 'amplication-container-builder/dist/cloud-build';
import Docker from 'dockerode';
import { CloudBuildClient } from '@google-cloud/cloudbuild';

export const CONTAINER_BUILDER_DEFAULT_VAR = 'CONTAINER_BUILDER_DEFAULT';
export const APPS_GCP_PROJECT_ID_VAR = 'APPS_GCP_PROJECT_ID';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ContainerBuilderRootModule = ContainerBuilderModule.forRootAsync({
  useFactory: (configService: ConfigService) => {
    const containerBuilderDefault = configService.get(
      CONTAINER_BUILDER_DEFAULT_VAR
    );
    const appsGCPProjectId = configService.get(APPS_GCP_PROJECT_ID_VAR);
    return {
      default: containerBuilderDefault,
      providers: {
        docker: new DockerProvider(new Docker()),
        'cloud-build': new CloudBuildProvider(
          new CloudBuildClient(),
          appsGCPProjectId
        )
      }
    };
  },
  inject: [ConfigService],
  imports: [ConfigModule]
});
