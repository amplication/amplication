import { CloudBuildClient } from "@google-cloud/cloudbuild/build/src/v1/cloud_build_client";
import { Storage } from "@google-cloud/storage";
import { Pack } from "tar-stream";
import zlib from "zlib";
import { IProvider, DeployResult, Configuration, Variables } from "../types";
import { BackendConfiguration } from "../types/BackendConfiguration";
import { createConfig } from "./config";
import * as modules from "./modules";
import { createHash } from "./hash.util";

export const TERRAFORM_MAIN_FILE_NAME = "main.tf.json";
export const TERRAFORM_VARIABLES_FILE_NAME = "terraform.tfvars.json";

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
    const [cloudBuildBuild] = await this.cloudBuild.createBuild({
      projectId: this.projectId,
      build: createConfig(this.bucket, archiveFilename, backendConfiguration),
    });
    // Wait for build to finish
    await cloudBuildBuild.promise();
    return {};
  }

  /**
   * Saves provided tar archive as tar gz archive in Cloud Storage with the archive hash as filename
   * @param pack archive to save
   * @returns archive file name in storage
   */
  private async saveArchive(pack: Pack): Promise<string> {
    const stream = pack.pipe(zlib.createGzip());
    const hash = await createHash(stream);
    const archiveFilename = `${hash}.tar.gz`;
    const archiveFile = this.storage.bucket(this.bucket).file(archiveFilename);
    return new Promise((resolve, reject) => {
      stream
        .pipe(archiveFile.createWriteStream())
        .on("error", reject)
        .on("finish", () => resolve(archiveFilename));
    });
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
}
