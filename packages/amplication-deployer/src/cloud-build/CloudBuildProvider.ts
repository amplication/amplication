import { CloudBuildClient } from "@google-cloud/cloudbuild/build/src/v1/cloud_build_client";
import { Storage } from "@google-cloud/storage";
import zlib from "zlib";
import { IProvider, DeployResult, Configuration, Variables } from "../types";
import { BackendConfiguration } from "../types/BackendConfiguration";
import { createConfig } from "./config";
import * as modules from "./modules";

export class CloudBuildProvider implements IProvider {
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
      /** @todo better name */
      const archiveFilename = `${Math.random().toString(32)}.tar.gz`;
      const pack = modules.createTar();
      /** @todo move to var */
      pack.entry({ name: "main.tf.json" }, JSON.stringify(configuration)).end();
      if (variables) {
        pack
          /** @todo move to var */
          .entry({ name: "terraform.tfvars.json" }, JSON.stringify(variables))
          .end();
      }

      const readStream = pack.pipe(zlib.createGzip());
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
