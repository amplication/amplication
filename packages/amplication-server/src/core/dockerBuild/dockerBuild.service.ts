import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from '@google-cloud/cloudbuild/build/protos/protos';
import { DockerService } from './docker.service';
import { CloudBuildService } from './cloudBuild.service';
import baseCloudBuildConfig from './base-cloud-build-config.json';
import { parseGCSAuthenticatedURL } from './gcs.util';

type BuildResult = {
  images: string[];
};

export enum DockerBuildProvider {
  Local = 'local',
  GoogleCloudBuild = 'google-cloud-build'
}

export const DOCKER_BUILD_PROVIDER_VAR = 'DOCKER_BUILD_PROVIDER';
export const APPS_GCP_PROJECT_ID_VAR = 'APPS_GCP_PROJECT_ID';
export const IMAGE_REPOSITORY_SUBSTITUTION_KEY = '_IMAGE_REPOSITORY';
export const IMAGE_TAG_SUBSTITUTION_KEY = '_BUILD_ID';

export function createCloudBuildConfig(
  repository: string,
  tag: string,
  codeURL: string
): google.devtools.cloudbuild.v1.IBuild {
  const { bucket, object } = parseGCSAuthenticatedURL(codeURL);
  return {
    ...baseCloudBuildConfig,
    source: {
      storageSource: {
        bucket,
        object
      }
    },
    substitutions: {
      /** @todo use a nicer repository name */
      [IMAGE_REPOSITORY_SUBSTITUTION_KEY]: repository,
      [IMAGE_TAG_SUBSTITUTION_KEY]: tag
    }
  };
}

export function createLocalImageId(repository: string, tag: string): string {
  return `${repository}:${tag}`;
}

@Injectable()
export class DockerBuildService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dockerService: DockerService,
    private readonly cloudBuildService: CloudBuildService
  ) {}

  /**
   * Builds a image of given repository and tag with the source code frm given codeURL
   * @param repository the desired Docker image repository
   * @param tag the desired Docker image tag
   * @param codeURL the source code URL to use for getting code for Docker image
   */
  async build(
    repository: string,
    tag: string,
    codeURL: string
  ): Promise<BuildResult> {
    const provider = this.configService.get(DOCKER_BUILD_PROVIDER_VAR);
    switch (provider) {
      case DockerBuildProvider.GoogleCloudBuild:
        return this.buildCloudBuild(repository, tag, codeURL);
      case DockerBuildProvider.Local:
        return this.localBuild(repository, tag, codeURL);
      default:
        throw new Error(`Unknown build provider: "${provider}"`);
    }
  }

  private async localBuild(repository: string, tag: string, codeURL: string) {
    const imageId = createLocalImageId(repository, tag);
    await this.dockerService.buildImage(codeURL, {
      t: imageId
    });
    return { images: [imageId] };
  }

  private async buildCloudBuild(
    repository: string,
    tag: string,
    codeURL: string
  ): Promise<BuildResult> {
    const projectId = this.configService.get(APPS_GCP_PROJECT_ID_VAR);
    if (!projectId) {
      throw new Error(
        "Can't build with Cloud Build as Google Cloud Platform project ID is not defined"
      );
    }
    const [cloudBuildBuild] = await this.cloudBuildService.createBuild({
      projectId,
      build: createCloudBuildConfig(repository, tag, codeURL)
    });
    // Wait for build to finish
    const [finishedCloudBuildBuild] = await cloudBuildBuild.promise();
    /** @todo compute run time */
    // finishedCloudBuildBuild.startTime.seconds - finishedCloudBuildBuild.finishTime.seconds
    return { images: finishedCloudBuildBuild.images };
  }
}
