import { NotImplementedException } from "@nestjs/common";
import Docker from "dockerode";
import { IProvider, BuildResult, EnumBuildStatus } from "../types";
import { BuildRequest } from "../types/BuildRequest";

export function createImageID(repository: string, tag: string): string {
  return `${repository}:${tag}`;
}

export class DockerProvider implements IProvider {
  constructor(readonly docker: Docker) {}
  async build(request: BuildRequest): Promise<BuildResult> {
    const imageId = createImageID(request.repository, request.tag);
    await this.docker.buildImage(request.url, {
      t: imageId,
      buildargs: request.args,
    });
    return { images: [imageId], status: EnumBuildStatus.Completed };
  }

  async getStatus(statusQuery: any): Promise<BuildResult> {
    throw new NotImplementedException(
      "getStatus is not implemented for DockerProvider"
    );
  }
}
