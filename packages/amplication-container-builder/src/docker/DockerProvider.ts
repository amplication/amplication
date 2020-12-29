import { NotImplementedException } from "@nestjs/common";
import Docker from "dockerode";
import { IProvider, BuildResult, EnumBuildStatus } from "../types";
import { BuildRequest } from "../types/BuildRequest";

export type BuildImageOptions = {
  t?: string;
  buildargs?: Record<string, string>;
  cachefrom?: string;
};

export class DockerProvider implements IProvider {
  constructor(readonly docker: Docker) {}
  async build(request: BuildRequest): Promise<BuildResult> {
    const imageId = createImageID(request.repository, request.tag);
    const options = createBuildImageOptions(request, imageId);
    await this.docker.buildImage(request.url, options);
    return { images: [imageId], status: EnumBuildStatus.Completed };
  }

  async getStatus(statusQuery: any): Promise<BuildResult> {
    throw new NotImplementedException(
      "getStatus is not implemented for DockerProvider"
    );
  }
}

export function createImageID(repository: string, tag: string): string {
  return `${repository}:${tag}`;
}

export function createBuildImageOptions(
  request: BuildRequest,
  imageId: string
): BuildImageOptions {
  return {
    t: imageId,
    buildargs: request.args,
    cachefrom: request.cacheFrom,
  };
}
