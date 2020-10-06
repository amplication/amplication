// import Docker from "dockerode";
// import { IProvider, DeployResult } from "../types";

// export function createImageID(repository: string, tag: string): string {
//   return `${repository}:${tag}`;
// }

// export class DockerProvider implements IProvider {
//   constructor(readonly docker: Docker) {}
//   async deploy(
//     repository: string,
//     tag: string,
//     url: string,
//     buildArgs: Record<string, string>
//   ): Promise<DeployResult> {
//     const imageId = createImageID(repository, tag);
//     await this.docker.buildImage(url, {
//       t: imageId,
//       buildargs: buildArgs,
//     });
//     return { images: [imageId] };
//   }
// }
