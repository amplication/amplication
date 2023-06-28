import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import assert from "assert";
import { compare } from "dir-compare";
import { sync } from "fast-glob";
import { existsSync, readFileSync } from "fs";
import { normalize } from "path";
import { File } from "@amplication/util/git";
import { mapDiffSetToPrModule } from "./diffset-mapper";
import { BuildPathFactory } from "./build-path-factory";
import { deleteFilesVisitor } from "./delete-files";
import { MissingBuildFiles } from "../errors/MissingBuildFiles";
import { Traceable } from "@amplication/opentelemetry-nestjs";

@Traceable()
@Injectable()
export class DiffService {
  constructor(
    private readonly buildsPathFactory: BuildPathFactory,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}
  async listOfChangedFiles(
    resourceId: string,
    previousAmplicationBuildId: string | undefined,
    newAmplicationBuildId: string
  ): Promise<File[]> {
    const newBuildPath = this.buildsPathFactory.get(
      resourceId,
      newAmplicationBuildId
    );

    DiffService.validateIfBuildExist(newBuildPath, newAmplicationBuildId);

    // If an old build folder does not exist, we return all new files
    if (!previousAmplicationBuildId) {
      return this.getAllModulesForPath(newBuildPath);
    }
    const oldBuildPath = this.buildsPathFactory.get(
      resourceId,
      previousAmplicationBuildId
    );

    if (!existsSync(oldBuildPath)) {
      this.logger.warn("Got a old build id but the folder does not exist", {
        resourceId,
        oldBuildPath,
      });
      return this.getAllModulesForPath(newBuildPath);
    }

    this.logger.info("List of the paths", {
      resourceId,
      previousAmplicationBuildId,
      newAmplicationBuildId,
    });
    assert.notStrictEqual(
      oldBuildPath,
      newBuildPath,
      "Cant get the same build id"
    );

    DiffService.validateIfBuildExist(oldBuildPath, previousAmplicationBuildId);

    const res = await compare(oldBuildPath, newBuildPath, {
      compareContent: true,
      compareDate: false,
      compareSize: false,
      compareSymlink: false,
      skipEmptyDirs: true,
    });

    this.logger.debug("Finish the dir-compare lib process");

    if (!res?.diffSet) {
      throw new Error("Error in creating a diff set");
    }

    const modules = mapDiffSetToPrModule(res.diffSet, [deleteFilesVisitor]);

    const resultModule = await Promise.all([
      ...(await this.getAllModulesForPath(newBuildPath)),
      ...modules,
    ]);
    return resultModule;
  }

  private async getAllModulesForPath(buildPath: string) {
    const basePathLength = buildPath.length;
    const files = sync(`${buildPath}/**`, { dot: true }).map(
      async (fullPath) => {
        const path = normalize(fullPath.slice(basePathLength));
        const code = await readFileSync(fullPath).toString("utf8");
        return {
          path,
          content: code,
        };
      }
    );
    return await Promise.all(files);
  }

  private static validateIfBuildExist(
    buildPath: string,
    buildId: string
  ): void {
    const isExisting = existsSync(buildPath);
    if (isExisting === false) {
      throw new MissingBuildFiles(buildId);
    }
    return;
  }
}
