import { CloudBuildClient } from "@google-cloud/cloudbuild/build/src/v1/cloud_build_client";
import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import * as winston from "winston";
import { IProvider, BuildResult, EnumBuildStatus } from "../types";
import { defaultLogger } from "./logging";
import { createConfig } from "./config";
import { InvalidBuildProviderState } from "../builder/InvalidBuildProviderState";
import { BuildRequest } from "../types/BuildRequest";

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
    readonly projectId: string,
    readonly logger: winston.Logger = defaultLogger
  ) {}
  async build(request: BuildRequest): Promise<BuildResult> {
    const logger = this.logger.child({ request });

    logger.info("Building container...");

    const [operation] = await this.cloudBuild.createBuild({
      projectId: this.projectId,
      build: createConfig(request),
    });

    const {
      build,
    } = (operation.metadata as unknown) as google.devtools.cloudbuild.v1.BuildOperationMetadata;

    if (!build) {
      throw new Error("Unexpected undefined build");
    }

    logger.info("Created Cloud Build", {
      buildId: build.id,
    });

    return {
      status: EnumBuildStatus.Running,
      statusQuery: { id: build.id },
    };
  }

  async getStatus(statusQuery: StatusQuery): Promise<BuildResult> {
    this.logger.info("Getting status for container build", {
      query: statusQuery,
    });

    const [build] = await this.cloudBuild.getBuild({
      projectId: this.projectId,
      id: statusQuery.id,
    });

    if (!build) {
      throw new InvalidBuildProviderState(
        statusQuery,
        "Can't find the specified build in Cloud Build"
      );
    }
    switch (build.status) {
      case EnumCloudBuildStatus.Working:
      case EnumCloudBuildStatus.Queued:
        return {
          status: EnumBuildStatus.Running,
          statusQuery: statusQuery,
        };
      case EnumCloudBuildStatus.Success:
        return {
          status: EnumBuildStatus.Completed,
          images: build.images as string[],
        };

      default:
        return {
          status: EnumBuildStatus.Failed,
        };
    }
  }
}
