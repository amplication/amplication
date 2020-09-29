import { Injectable } from '@nestjs/common';
import { CloudBuildClient } from '@google-cloud/cloudbuild';
import { google } from '@google-cloud/cloudbuild/build/protos/protos';
import * as googleCloudStorageURIParser from 'google-cloud-storage-uri-parser';
import cloudBuildConfig from './cloud-build-config.json';
import { ConfigService } from '@nestjs/config';

type BuildResult = {
  images: string[];
};

export const APPS_GCP_PROJECT_ID_VAR = 'APPS_GCP_PROJECT_ID';
export const IMAGE_REPOSITORY_SUBSTITUTION_KEY = '_IMAGE_REPOSITORY';
export const IMAGE_TAG_SUBSTITUTION_KEY = '_BUILD_ID';

export function createCloudBuildConfig(
  repository: string,
  tag: string,
  codeURL: string
): google.devtools.cloudbuild.v1.IBuild {
  const { bucket, file } = googleCloudStorageURIParser.parse(codeURL);
  return {
    ...cloudBuildConfig,
    source: {
      storageSource: {
        bucket,
        object: file
      }
    },
    substitutions: {
      /** @todo use a nicer repository anem */
      [IMAGE_REPOSITORY_SUBSTITUTION_KEY]: repository,
      [IMAGE_TAG_SUBSTITUTION_KEY]: tag
    }
  };
}

@Injectable()
export class DockerBuildService {
  constructor(private readonly configService: ConfigService) {}

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
    return this.buildCloudBuild(repository, tag, codeURL);
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
    /** @todo move to service */
    const cloudBuild = new CloudBuildClient();
    const [cloudBuildBuild] = await cloudBuild.createBuild({
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
