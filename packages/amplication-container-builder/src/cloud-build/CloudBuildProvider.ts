import { CloudBuildClient } from "@google-cloud/cloudbuild/build/src/v1/cloud_build_client";
import { IProvider, BuildResult, EnumBuildStatus } from "../types";
import { createConfig } from "./config";
import { InvalidBuildProviderState } from "../builder/InvalidBuildProviderState";

type StatusQuery = {
  filter: string;
};

const BUILD_STATUS_WORKING = "WORKING";
const BUILD_STATUS_QUEUED = "QUEUED";
const BUILD_STATUS_SUCCESS = "SUCCESS";

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

    return {
      status: EnumBuildStatus.Running,
      statusQuery: { filter: `tags="${tag}"` },
    };
  }

  async getStatus(statusQuery: any): Promise<BuildResult> {
    const data: StatusQuery = statusQuery;
    const [buildList] = await this.cloudBuild.listBuilds({
      projectId: this.projectId,
      filter: data.filter,
      pageSize: 1,
    });

    const [build] = buildList;
    if (!build) {
      throw new InvalidBuildProviderState(
        statusQuery,
        "Can't find the specified build in Cloud Build service"
      );
    }
    switch (build.status) {
      case BUILD_STATUS_WORKING:
      case BUILD_STATUS_QUEUED:
        return {
          status: EnumBuildStatus.Running,
          statusQuery: { filter: `build_id="${build.id}"` },
        };
        break;
      case BUILD_STATUS_SUCCESS:
        return {
          status: EnumBuildStatus.Completed,
          images: build.images as string[],
        };
        break;

      default:
        return {
          status: EnumBuildStatus.Failed,
        };
        break;
    }
  }
}
