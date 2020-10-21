import { CloudBuildClient } from "@google-cloud/cloudbuild/build/src/v1/cloud_build_client";
import { Storage } from "@google-cloud/storage";
import { Pack } from "tar-stream";
import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import zlib from "zlib";
import getStream from "get-stream";
import {
  IProvider,
  DeployResult,
  EnumDeployStatus,
  Configuration,
  Variables,
} from "../types";
import { BackendConfiguration } from "../types/BackendConfiguration";
import { createConfig } from "./config";
import * as modules from "./modules";
import { createHash } from "./hash.util";
import { InvalidDeployProviderState } from "../deployer/InvalidDeployProviderState";

export const TERRAFORM_MAIN_FILE_NAME = "main.tf.json";
export const TERRAFORM_VARIABLES_FILE_NAME = "terraform.tfvars.json";

type StatusQuery = {
  id: string;
};

enum EnumCloudBuildStatus {
  Working = "WORKING",
  Queued = "QUEUED",
  Success = "SUCCESS",
}

export class GCPProvider implements IProvider {
  constructor(
    readonly cloudBuild: CloudBuildClient,
    readonly storage: Storage,
    readonly projectId: string,
    readonly bucket: string
  ) {}

  async deploy(
    configuration: Configuration,
    variables?: Variables,
    backendConfiguration?: BackendConfiguration
  ): Promise<DeployResult> {
    const pack = await this.createArchive(configuration, variables);
    const archiveFilename = await this.saveArchive(pack);
    const [operation] = await this.cloudBuild.createBuild({
      projectId: this.projectId,
      build: createConfig(this.bucket, archiveFilename, backendConfiguration),
    });

    const {
      build,
    } = (operation.metadata as unknown) as google.devtools.cloudbuild.v1.BuildOperationMetadata;

    return {
      status: EnumDeployStatus.Running,
      statusQuery: { id: build?.id },
    };
  }

  /**
   * Saves provided tar archive as tar gz archive in Cloud Storage with the archive hash as filename
   * @param pack archive to save
   * @returns archive file name in storage
   */
  private async saveArchive(pack: Pack): Promise<string> {
    const stream = pack.pipe(zlib.createGzip());
    const [hash, buffer] = await Promise.all([
      createHash(stream),
      getStream.buffer(stream),
    ]);
    const filename = `${hash}.tar.gz`;
    const file = this.storage.bucket(this.bucket).file(filename);
    await file.save(buffer);
    return filename;
  }

  /**
   * Creates a tar archive with the provider modules, configuration file and variables file
   * @param configuration Terraform configuration
   * @param variables Terraform variables
   * @returns tar archive
   */
  private async createArchive(
    configuration: Configuration,
    variables?: Variables
  ): Promise<Pack> {
    const pack = modules.createTar();
    pack
      .entry({ name: TERRAFORM_MAIN_FILE_NAME }, JSON.stringify(configuration))
      .end();
    if (variables) {
      pack
        .entry(
          { name: TERRAFORM_VARIABLES_FILE_NAME },
          JSON.stringify(variables)
        )
        .end();
    }
    return pack;
  }

  async getStatus(statusQuery: any): Promise<DeployResult> {
    const data: StatusQuery = statusQuery;
    const [build] = await this.cloudBuild.getBuild({
      projectId: this.projectId,
      id: data.id,
    });

    if (!build) {
      throw new InvalidDeployProviderState(
        statusQuery,
        "Can't find the specified build in Cloud Build service"
      );
    }
    switch (build.status) {
      case EnumCloudBuildStatus.Working:
      case EnumCloudBuildStatus.Queued:
        return {
          status: EnumDeployStatus.Running,
          statusQuery: statusQuery,
        };
        break;
      case EnumCloudBuildStatus.Success:
        return {
          status: EnumDeployStatus.Completed,
        };
        break;

      default:
        return {
          status: EnumDeployStatus.Failed,
        };
        break;
    }
  }
}
