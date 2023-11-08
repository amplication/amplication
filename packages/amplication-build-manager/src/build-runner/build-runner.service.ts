import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DSGResourceData } from "@amplication/code-gen-types";
import { promises as fsPromises } from "fs";
import { join, dirname } from "path";
import { Env } from "../env";
import { Traceable } from "@amplication/opentelemetry-nestjs";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import * as tar from "tar";

@Traceable()
@Injectable()
export class BuildRunnerService {
  constructor(
    private readonly configService: ConfigService<Env, true>,
    private readonly logger: AmplicationLogger
  ) {}

  async saveDsgResourceData(
    buildId: string,
    dsgResourceData: DSGResourceData,
    codeGeneratorVersion: string
  ) {
    const savePath = join(
      this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
      buildId,
      this.configService.get(Env.DSG_JOBS_RESOURCE_DATA_FILE)
    );

    const saveDir = dirname(savePath);
    await fsPromises.mkdir(saveDir, { recursive: true });

    await fsPromises.writeFile(
      savePath,
      JSON.stringify({ ...dsgResourceData, codeGeneratorVersion })
    );
  }

  async getCodeGeneratorVersion(buildId: string) {
    const data = await fsPromises.readFile(
      join(
        this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
        buildId,
        this.configService.get(Env.DSG_JOBS_RESOURCE_DATA_FILE)
      )
    );

    const config = <DSGResourceData & { codeGeneratorVersion: string }>(
      JSON.parse(data.toString())
    );

    return config.codeGeneratorVersion;
  }

  async copyFromJobToArtifact(resourceId: string, buildId: string) {
    const jobPath = join(
      this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
      buildId,
      this.configService.get(Env.DSG_JOBS_CODE_FOLDER)
    );

    const compressPath = join(
      this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
      buildId
    );

    const artifactPath = join(
      this.configService.get(Env.BUILD_ARTIFACTS_BASE_FOLDER),
      resourceId,
      buildId
    );

    await fsPromises.mkdir(artifactPath, { recursive: true });

    const tarFile = join(compressPath, "archive.tar");

    try {
      this.logger.debug(`Compressing ${jobPath} to ${tarFile}...`);
      await tar.c(
        {
          file: tarFile,
        },
        [jobPath]
      );
      this.logger.debug(`Created tar file ${tarFile}`);

      this.logger.debug(`Extracting ${tarFile} to ${artifactPath}...`);
      await tar.x({
        file: tarFile,
        cwd: artifactPath,
      });
      this.logger.debug(`Extracted tar file ${tarFile} to ${artifactPath}`);
    } catch (error) {
      this.logger.error(`Error copying from job to artifact`, error);
      // passing the error to the caller, there we handle it (code-generation-success/failure)
      throw new Error(`Error copying from job to artifact`);
    }
  }
}
