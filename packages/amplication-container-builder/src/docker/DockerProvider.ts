import { NotImplementedException } from "@nestjs/common";
import Docker from "dockerode";
import * as winston from "winston";
import { defaultLogger } from "../logging";
import { IProvider, BuildResult, EnumBuildStatus } from "../types";
import { BuildRequest } from "../types/BuildRequest";

export type BuildImageOptions = {
  t?: string[];
  buildargs?: Record<string, string>;
  cachefrom?: string;
};

export class DockerProvider implements IProvider {
  constructor(
    readonly docker: Docker,
    readonly logger: winston.Logger = defaultLogger
  ) {}
  async build(request: BuildRequest): Promise<BuildResult> {
    const logger = this.logger.child({ request });
    logger.info("Building container...");
    const options = createBuildImageOptions(request);
    await this.docker.buildImage(request.url, options);
    logger.info("Built container successfully");
    return { images: request.tags, status: EnumBuildStatus.Completed };
  }

  async getStatus(statusQuery: any): Promise<BuildResult> {
    throw new NotImplementedException(
      "getStatus is not implemented for DockerProvider"
    );
  }

  createImageId(tag: string): string {
    return tag;
  }
}

export function createBuildImageOptions(
  request: BuildRequest
): BuildImageOptions {
  return {
    t: request.tags,
    buildargs: request.args,
    cachefrom: request.cacheFrom && JSON.stringify(request.cacheFrom),
  };
}
