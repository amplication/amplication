import Docker from "dockerode";
import { IProvider, BuildResult } from "../types";

export function createImageID(repository: string, tag: string): string {
  return `${repository}:${tag}`;
}

export class DockerProvider implements IProvider {
  constructor(readonly docker: Docker) {}
  async build(
    repository: string,
    tag: string,
    url: string
  ): Promise<BuildResult> {
    const imageId = createImageID(repository, tag);
    await this.docker.buildImage(url, {
      t: imageId,
    });
    return { images: [imageId] };
  }
}
