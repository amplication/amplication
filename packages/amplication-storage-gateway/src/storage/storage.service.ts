import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sync } from "glob";
import { BASE_BUILDS_FOLDER } from "src/constants";
import { FileMeta } from "./dto/FileMeta";
import { NodeTypeEnum } from "./dto/NodeTypeEnum";
import assert from "assert";
import { readFileSync } from "fs";

@Injectable()
export class StorageService {
  private buildsFolder: string | undefined;
  constructor(configService: ConfigService) {
    this.buildsFolder = configService.get<string>(BASE_BUILDS_FOLDER);
    assert(this.buildsFolder);
  }

  private buildFolder(appId: string, buildId: string) {
    return `${this.buildsFolder}/builds/${appId}/${buildId}`;
  }

  getBuildFilesList(appId: string, buildId: string, relativePath: string) {
    const results: { [name: string]: FileMeta } = {};

    const cwd = `${this.buildFolder(appId, buildId)}/${relativePath || ""}`;
    const files = sync(`*`, {
      nodir: true,
      dot: true,
      cwd,
    });
    files.forEach((file) => {
      results[file] = { name: file, type: NodeTypeEnum.File };
    });
    const foldersWithFiles = sync(`*`, { nodir: false, cwd });
    foldersWithFiles.forEach((file) => {
      if (!results[file]) {
        results[file] = { name: file, type: NodeTypeEnum.Folder };
      }
    });
    const resultsArray = Object.values(results).sort((a, b) => {
      if (a.type === NodeTypeEnum.Folder && b.type !== NodeTypeEnum.Folder) {
        return -1;
      }
      return a.name.localeCompare(b.name);
    });
    return resultsArray;
  }

  fileContent(appId: string, buildId: string, path: string): string {
    const filePath = `${this.buildFolder(appId, buildId)}/${path}`;
    return readFileSync(filePath).toString();
  }
}
