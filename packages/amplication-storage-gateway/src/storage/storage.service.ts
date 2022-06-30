import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import assert from "assert";
import { readFileSync } from "fs";
import { sync } from "glob";
import { join } from "path";
import { BASE_BUILDS_FOLDER } from "src/constants";
import { FileMeta } from "./dto/FileMeta";
import { NodeTypeEnum } from "./dto/NodeTypeEnum";

type FilesDictionary = { [name: string]: FileMeta };

@Injectable()
export class StorageService {
  private buildsFolder: string;
  constructor(configService: ConfigService) {
    const buildsFolder = configService.get<string>(BASE_BUILDS_FOLDER);
    assert(buildsFolder);
    console.log(`BASE_BUILDS_FOLDER ENV is ${buildsFolder}`);
    this.buildsFolder = buildsFolder;
  }

  private static buildFolder(
    buildsFolder: string,
    appId: string,
    buildId: string
  ) {
    return join(buildsFolder, appId, buildId);
  }

  getBuildFilesList(appId: string, buildId: string, relativePath: string = "") {
    const results: FilesDictionary = {};

    const cwd = `${StorageService.buildFolder(
      this.buildsFolder,
      appId,
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

  fileContent(appId: string, buildId: string, path: string = ""): string {
    const filePath = join(
      StorageService.buildFolder(this.buildsFolder, appId, buildId),
      path
    );
    return readFileSync(filePath).toString();
  }
}
