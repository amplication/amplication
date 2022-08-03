import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFileSync } from "fs";
import { sync } from "glob";
import { join } from "path";
import { BASE_BUILDS_FOLDER, DEFAULT_BUILDS_FOLDER } from "../constants";
import { FileMeta } from "./dto/FileMeta";
import { NodeTypeEnum } from "./dto/NodeTypeEnum";

type FilesDictionary = { [name: string]: FileMeta };

@Injectable()
export class StorageService {
  private buildsFolder: string;
  constructor(configService: ConfigService) {
    const buildsFolder = configService.get<string>(BASE_BUILDS_FOLDER);
    this.buildsFolder = buildsFolder || DEFAULT_BUILDS_FOLDER;
  }

  private static buildFolder(
    buildsFolder: string,
    resourceId: string,
    buildId: string
  ) {
    return join(buildsFolder, resourceId, buildId);
  }

  getBuildFilesList(
    resourceId: string,
    buildId: string,
    relativePath: string = ""
  ) {
    const results: FilesDictionary = {};

    const cwd = `${StorageService.buildFolder(
      this.buildsFolder,
      resourceId,
      buildId
    )}/${relativePath || ""}`;

    console.log(`Current working directory is ${cwd}`);

    const files = sync(`*`, {
      nodir: true,
      dot: true,
      cwd,
    });
    files.forEach((file) => {
      const path = join(relativePath, file);
      results[file] = {
        name: file,
        type: NodeTypeEnum.File,
        path: path,
      };
    });
    const foldersWithFiles = sync(`*`, { nodir: false, cwd });
    foldersWithFiles.forEach((file) => {
      if (!results[file]) {
        results[file] = {
          name: file,
          type: NodeTypeEnum.Folder,
          path: join(relativePath, file),
        };
      }
    });

    return StorageService.sortFoldersAndFiles(results);
  }

  private static sortFoldersAndFiles(files: FilesDictionary) {
    return Object.values(files).sort((a, b) => {
      // return the array with all the folders on top like vscode
      if (a.type === NodeTypeEnum.Folder && b.type !== NodeTypeEnum.Folder) {
        return -1;
      }
      // and then alphabetically
      return a.name.localeCompare(b.name);
    });
  }

  fileContent(resourceId: string, buildId: string, path: string = ""): string {
    const filePath = join(
      StorageService.buildFolder(this.buildsFolder, resourceId, buildId),
      path
    );
    return readFileSync(filePath).toString();
  }
}
