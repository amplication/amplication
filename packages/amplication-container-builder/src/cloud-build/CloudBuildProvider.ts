import { CloudBuildClient } from "@google-cloud/cloudbuild/build/src/v1/cloud_build_client";
import { IProvider, BuildResult } from "../types";
import { createConfig } from "./config";

export class CloudBuildProvider implements IProvider {
  constructor(
    readonly cloudBuild: CloudBuildClient,
    readonly projectId: string
  ) {}
  async build(
    repository: string,
    tag: string,
    codeURL: string
  ): Promise<BuildResult> {
    // const projectId = this.configService.get(this.projectId);
    // if (!projectId) {
    //   throw new Error(
    //     "Can't build with Cloud Build as Google Cloud Platform project ID is not defined"
    //   );
    // }
    const [cloudBuildBuild] = await this.cloudBuild.createBuild({
      projectId: this.projectId,
      build: createConfig(repository, tag, codeURL),
    });
    // Wait for build to finish
    const [finishedCloudBuildBuild] = await cloudBuildBuild.promise();
    /** @todo compute run time */
    // finishedCloudBuildBuild.startTime.seconds - finishedCloudBuildBuild.finishTime.seconds
    return { images: finishedCloudBuildBuild.images as string[] };
  }
}
