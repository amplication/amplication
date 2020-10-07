import path from "path";
import Docker from "dockerode";
import tarFs from "tar-fs";
import {
  IProvider,
  DeployResult,
  Configuration,
  Variables,
  BackendConfiguration,
} from "../types";

const MODULES_DIRECTORY = path.join(__dirname, "modules");

/** @todo move to shared util */
export function createBackendConfigParameter(
  key: string,
  value: string
): string {
  return `-backend-config=${key}=${value}`;
}

export const TERRAFORM_DOCKER_IMAGE = "hashicorp/terraform:light";

export class DockerProvider implements IProvider {
  constructor(readonly docker: Docker) {}
  async deploy(
    configuration: Configuration,
    variables?: Variables,
    backendConfiguration: BackendConfiguration = {}
  ): Promise<DeployResult> {
    /** @todo share code */
    const archive = tarFs.pack(MODULES_DIRECTORY, {
      map: (header) => {
        header.name = `modules/${header.name}`;
        return header;
      },
    });
    archive
      .entry({ name: "main.tf.json" }, JSON.stringify(configuration))
      .end();
    archive
      .entry({ name: "terraform.tfvars.json" }, JSON.stringify(variables))
      .end();

    const container = await this.docker.createContainer({
      Image: TERRAFORM_DOCKER_IMAGE,
    });
    await container.putArchive(archive, { path: "/" });
    return new Promise((resolve, reject) => {
      container.start(async (err) => {
        if (err) {
          reject(err);
        }
        await container
          .exec({
            Cmd: [
              "init",
              ...Object.entries(backendConfiguration).map(([key, value]) =>
                createBackendConfigParameter(key, value)
              ),
            ],
          })
          .catch(reject);
        await container
          .exec({
            Cmd: ["apply"],
          })
          .catch(reject);
        resolve({});
      });
    });
  }
}
