import { CloudBuildClient } from "@google-cloud/cloudbuild/build/src/v1/cloud_build_client";
import { IProvider, BuildResult, EnumBuildStatus } from "../types";
import { createConfig } from "./config";
import { InvalidBuildProviderState } from "../builder/InvalidBuildProviderState";
import { google } from "@google-cloud/cloudbuild/build/protos/protos";

type StatusQuery = {
  id: string;
};

enum EnumCloudBuildStatus {
  Working = "WORKING",
  Queued = "QUEUED",
  Success = "SUCCESS",
}

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
    const [operation] = await this.cloudBuild.createBuild({
      projectId: this.projectId,
      build: createConfig(repository, tag, url, buildArgs),
    });

    const {
      build,
    } = (operation.metadata as unknown) as google.devtools.cloudbuild.v1.BuildOperationMetadata;

    return {
      status: EnumBuildStatus.Running,
      statusQuery: { id: build?.id },
    };
  }

  async getStatus(statusQuery: any): Promise<BuildResult> {
    const data: StatusQuery = statusQuery;
    const [build] = await this.cloudBuild.getBuild({
      projectId: this.projectId,
      id: data.id,
    });

    if (!build) {
      throw new InvalidBuildProviderState(
        statusQuery,
        "Can't find the specified build in Cloud Build service"
      );
    }
    switch (build.status) {
      case EnumCloudBuildStatus.Working:
      case EnumCloudBuildStatus.Queued:
        return {
          status: EnumBuildStatus.Running,
          statusQuery: statusQuery,
        };
        break;
      case EnumCloudBuildStatus.Success:
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
