import path from "path";
import Docker from "dockerode";
import tarFs from "tar-fs";
import {
  IProvider,
  DeployResult,
  Configuration,
  Variables,
  BackendConfiguration,
  EnumDeployStatus,
} from "../types";
import { NotImplementedException } from "@nestjs/common";

export const TERRAFORM_DOCKER_IMAGE = "hashicorp/terraform:light";
export const DOCKER_ENTRYPOINT = "sh";

const MODULES_DIRECTORY = path.join(__dirname, "modules");

/** @todo move to shared util */
export function createBackendConfigParameter(
  key: string,
  value: string
): string {
  return `-backend-config=${key}=${value}`;
}

/** @todo persist terraform state to a volume */
export class DockerProvider implements IProvider {
  constructor(readonly docker: Docker) {}
  async deploy(
    configuration: Configuration,
    variables?: Variables,
    backendConfiguration: BackendConfiguration = {}
  ): Promise<DeployResult> {
    /** @todo share code */
    const archive = this.createArchive(configuration, variables);

    console.debug(`Pulling ${TERRAFORM_DOCKER_IMAGE}`);
    await this.docker.pull(TERRAFORM_DOCKER_IMAGE);

    console.debug(`Creating container with image: ${TERRAFORM_DOCKER_IMAGE}`);
    const initParameters = Object.entries(backendConfiguration)
      .map(([key, value]) => createBackendConfigParameter(key, value))
      .join(" ");
    const container = await this.docker.createContainer({
      Image: TERRAFORM_DOCKER_IMAGE,
      Entrypoint: DOCKER_ENTRYPOINT,
      Cmd: [
        "-c",
        `set -e;
terraform init ${initParameters};
terraform apply -auto-approve;`,
      ],
    });

    console.debug(`Putting archive in container ${container.id}`);
    await container.putArchive(archive, { path: "/" });

    console.debug(`Starting container ${container.id}`);
    await container.start();

    console.debug(`Waiting for container to finish ${container.id}`);
    await container.wait();

    /** @todo throw error if failed */

    return { status: EnumDeployStatus.Completed };
  }


  async destroy(
    configuration: Configuration,
    variables?: Variables,
    backendConfiguration: BackendConfiguration = {}
  ): Promise<DeployResult> {

    //not implemented
    return { status: EnumDeployStatus.Failed };


  }

  createArchive(
    configuration: Configuration,
    variables?: Variables
  ): tarFs.Pack {
    const archive = tarFs.pack(MODULES_DIRECTORY, {
      map: (header) => {
        header.name = `modules/${header.name}`;
        return header;
      },
    });
    archive
      .entry({ name: "main.tf.json" }, JSON.stringify(configuration))
      .end();
    if (variables) {
      archive
        .entry({ name: "terraform.tfvars.json" }, JSON.stringify(variables))
        .end();
    }
    return archive;
  }

  async getStatus(statusQuery: any): Promise<DeployResult> {
    throw new NotImplementedException(
      "getStatus is not implemented for DockerProvider"
    );
  }
}
