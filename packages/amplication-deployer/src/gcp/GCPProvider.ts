import stream from "stream";
import crypto from "crypto";
import { CloudBuildClient } from "@google-cloud/cloudbuild/build/src/v1/cloud_build_client";
import { Storage } from "@google-cloud/storage";
import zlib from "zlib";
import { IProvider, DeployResult, Configuration, Variables } from "../types";
import { BackendConfiguration } from "../types/BackendConfiguration";
import { createConfig } from "./config";
import * as modules from "./modules";

export const TERRAFORM_MAIN_FILE_NAME = "main.tf.json";
export const TERRAFORM_VARIABLES_FILE_NAME = "terraform.tfvars.json";

function createArchiveHash(stream: stream.Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha1");
    hash.setEncoding("hex");

    stream.on("end", () => {
      hash.end();
      resolve(hash.read());
    });
    stream.on("error", reject);
    hash.on("error", reject);

    stream.pipe(hash);
  });
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
    const archiveFileName = await this.createArchive(configuration, variables);
    const [cloudBuildBuild] = await this.cloudBuild.createBuild({
      projectId: this.projectId,
      build: createConfig(this.bucket, archiveFileName, backendConfiguration),
    });
    // Wait for build to finish
    await cloudBuildBuild.promise();
    return {};
  }

  /** @todo add configurations files to archive */
  private createArchive(
    configuration: Configuration,
    variables?: Variables
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const pack = modules.createTar();
      /** @todo move to var */
      pack
        .entry(
          { name: TERRAFORM_MAIN_FILE_NAME },
          JSON.stringify(configuration)
        )
        .end();
      if (variables) {
        pack
          /** @todo move to var */
          .entry(
            { name: TERRAFORM_VARIABLES_FILE_NAME },
            JSON.stringify(variables)
          )
          .end();
      }
      const readStream = pack.pipe(zlib.createGzip());
      const hash = createArchiveHash(readStream);
      const archiveFilename = `${hash}.tar.gz`;
      const archiveFile = this.storage
        .bucket(this.bucket)
        .file(archiveFilename);
      readStream
        .pipe(archiveFile.createWriteStream())
        .on("error", reject)
        .on("finish", () => resolve(archiveFilename));
    });
  }
}
