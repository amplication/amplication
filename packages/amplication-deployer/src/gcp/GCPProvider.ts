import { CloudBuildClient } from "@google-cloud/cloudbuild/build/src/v1/cloud_build_client";
import { Storage } from "@google-cloud/storage";
import { Pack } from "tar-stream";
import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import zlib from "zlib";
import getStream from "get-stream";
import * as winston from "winston";
import {
  IProvider,
  DeployResult,
  EnumDeployStatus,
  Configuration,
  Variables,
} from "../types";
import { BackendConfiguration } from "../types/BackendConfiguration";
import { defaultLogger } from "./logging";
import { createConfig, createDestroyConfig } from "./config";
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
    readonly bucket: string,
    readonly logger: winston.Logger = defaultLogger
  ) {}

  async deploy(
    configuration: Configuration,
    variables?: Variables,
    backendConfiguration?: BackendConfiguration
  ): Promise<DeployResult> {
    const logger = this.logger.child({ variables });

    logger.info("Deploying...", {
      configuration,
      backendConfiguration,
    });

    const pack = await this.createArchive(configuration, variables);
    const archiveFilename = await this.saveArchive(pack);
    const [operation] = await this.cloudBuild.createBuild({
      projectId: this.projectId,
      build: createConfig(
        this.bucket,
        archiveFilename,
        backendConfiguration,
        variables
      ),
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
      status: EnumDeployStatus.Running,
      statusQuery: { id: build.id },
    };
  }

  async destroy(
    configuration: Configuration,
    variables?: Variables,
    backendConfiguration?: BackendConfiguration
  ): Promise<DeployResult> {
    const logger = this.logger.child({ variables });

    logger.info("Destroying deployment...", {
      configuration,
      backendConfiguration,
    });

    const pack = await this.createArchive(configuration, variables);
    const archiveFilename = await this.saveArchive(pack);
    const [operation] = await this.cloudBuild.createBuild({
      projectId: this.projectId,
      build: createDestroyConfig(
        this.bucket,
        archiveFilename,
        backendConfiguration,
        variables
      ),
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
      status: EnumDeployStatus.Running,
      statusQuery: { id: build.id },
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

  async getStatus(statusQuery: StatusQuery): Promise<DeployResult> {
    this.logger.info("Getting status for deploy", { query: statusQuery });

    const [build] = await this.cloudBuild.getBuild({
      projectId: this.projectId,
      id: statusQuery.id,
    });

    if (!build) {
      throw new InvalidDeployProviderState(
        statusQuery,
        "Can not find the specified build in Cloud Build"
      );
    }

    switch (build.status) {
      case EnumCloudBuildStatus.Working:
      case EnumCloudBuildStatus.Queued:
        return {
          status: EnumDeployStatus.Running,
          statusQuery: statusQuery,
        };
      case EnumCloudBuildStatus.Success:
        const logs = await this.getLogs(build);
        const output = getOutput(logs);
        return {
          status: EnumDeployStatus.Completed,
          /** @todo return full output and let consumer extract url */
          url: output?.url.value,
        };

      default:
        return {
          status: EnumDeployStatus.Failed,
        };
    }
  }

  private async getLogs(
    build: google.devtools.cloudbuild.v1.IBuild
  ): Promise<Buffer> {
    if (!build.logsBucket) {
      throw new Error(`Build ${build.id} does not have a logs bucket`);
    }

    const logFile = this.storage
      .bucket(build.logsBucket)
      .file(`log-${build.id}.txt`);

    const [buffer] = await logFile.download();
    return buffer;
  }
}

function getOutput(logs: Buffer): Record<string, { value: string }> | null {
  const text = logs.toString();

  const outputLogs = Array.from(
    // @ts-ignore
    text.matchAll(/^Step #\d+ - "terraform-output": (.+)/gm)
  )
    .map((match) => match[1])
    .join("\n");

  const outputJSONMatch = outputLogs.match(/\{[\s\S]+\}/);

  if (outputJSONMatch) {
    return JSON.parse(outputJSONMatch[0]);
  }

  return null;
}
