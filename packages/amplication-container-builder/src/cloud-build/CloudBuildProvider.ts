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
    url: string,
    buildArgs: Record<string, string>
  ): Promise<BuildResult> {
    const [cloudBuildBuild] = await this.cloudBuild.createBuild({
      projectId: this.projectId,
      build: createConfig(repository, tag, url, buildArgs),
    });
    // Wait for build to finish
    const [finishedCloudBuildBuild] = await cloudBuildBuild.promise();
    return { images: finishedCloudBuildBuild.images as string[] };
  }
}
