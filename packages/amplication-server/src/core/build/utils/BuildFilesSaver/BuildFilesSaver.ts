import { Module } from "@amplication/code-gen-types";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { outputFile, remove } from "fs-extra";
import { join, normalize } from "path";
import { BASE_BUILDS_FOLDER } from "../../../../constants";
import { AmplicationError } from "../../../../errors/AmplicationError";
@Injectable()
export class BuildFilesSaver {
  private baseBuildsPath: string;
  constructor(
    configService: ConfigService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {
    this.baseBuildsPath = normalize(
      configService.get<string>(BASE_BUILDS_FOLDER)
    );
  }
  async saveFiles(relativePath: string, modules: Module[]): Promise<void> {
    this.logger.info(
      `Got a request for saving ${modules.length} files in ${relativePath} path`
    );
    try {
      const filesPromises = modules.map(async (module, i) => {
        const filePath = join(this.baseBuildsPath, relativePath, module.path);
        return outputFile(filePath, module.code);
      });
      await Promise.all(filesPromises);
    } catch (error) {
      await remove(join(this.baseBuildsPath, relativePath));
      throw new AmplicationError(
        "There was a error in saving the generated files to the amplication file system"
      );
    }
  }
}
