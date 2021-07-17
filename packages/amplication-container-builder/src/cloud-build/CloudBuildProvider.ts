import { CloudBuildClient } from "@google-cloud/cloudbuild/build/src/v1/cloud_build_client";
import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import * as winston from "winston";
import {
  BuildRequest,
  BuildResult,
  EnumBuildStatus,
  IProvider,
} from "../types";
import { defaultLogger } from "../logging";
import { createConfig, createImageId, DESTINATION_ARG } from "./config";
import { InvalidBuildProviderState } from "../builder/InvalidBuildProviderState";

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
      build: createConfig(request, this.projectId),
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
          images: this.getImagesFromBuild(build),
        };

      default:
        return {
          status: EnumBuildStatus.Failed,
        };
    }
  }

  createImageId(tag: string): string {
    return createImageId(tag, this.projectId);
  }

  getImagesFromBuild(build: google.devtools.cloudbuild.v1.IBuild): string[] {
    const args = build.steps && build.steps.length && build.steps[0].args;
    if (args) {
      const destinations = args.filter((destination) =>
        destination.startsWith(`--${DESTINATION_ARG}`)
      );

      return destinations.map((destination) =>
        destination.replace(`--${DESTINATION_ARG}=`, "")
      );
    }
    return [];
  }
}
