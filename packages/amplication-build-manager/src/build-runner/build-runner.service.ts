import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DSGResourceData } from "@amplication/code-gen-types";
import * as fs from "fs";
import { promises as fsPromises } from "fs";
import { join, dirname } from "path";
import { Env } from "../env";
import { Traceable } from "@amplication/opentelemetry-nestjs";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import * as tar from "tar-stream";

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

    const tarFile = join(compressPath, "archive.tar");

    this.logger.debug(`Compressing ${jobPath} to ${tarFile}`);
    await this.tarDirectory(jobPath, tarFile);
    this.logger.debug(`Created tar file ${tarFile}`);

    await this.untarDirectory(tarFile, artifactPath);
    this.logger.debug(`Extracted tar file ${tarFile} to ${artifactPath}`);
  }

  async packDirectory(pack, source, relativePath = "") {
    const files = fs.readdirSync(source);
    for (const file of files) {
      const filePath = join(source, file);
      const relFilePath = join(relativePath, file);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        pack.entry({ name: relFilePath }, fs.readFileSync(filePath));
      } else if (stat.isDirectory()) {
        await this.packDirectory(pack, filePath, relFilePath);
      }
    }
  }

  tarDirectory(source, destination) {
    return new Promise((resolve, reject) => {
      const pack = tar.pack();
      const outputFile = fs.createWriteStream(destination);

      pack.pipe(outputFile);

      this.packDirectory(pack, source)
        .then(() => {
          pack.finalize();
        })
        .catch(reject);

      outputFile.on("finish", resolve);
    });
  }

  untarDirectory(source, destination) {
    return new Promise((resolve, reject) => {
      const extract = tar.extract();
      const inputFile = fs.createReadStream(source);

      inputFile.pipe(extract);

      extract.on("entry", (header, stream, next) => {
        const outputPath = join(destination, header.name);
        const outputDir = dirname(outputPath);

        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputFile = fs.createWriteStream(outputPath);
        stream.pipe(outputFile);
        stream.on("end", next);
      });

      extract.on("finish", resolve);
    });
  }
}
