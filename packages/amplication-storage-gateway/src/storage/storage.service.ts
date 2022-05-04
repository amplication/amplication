import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sync } from "glob";
import { BASE_BUILDS_FOLDER } from "src/constants";
import { FileMeta } from "./dto/FileMeta";
import { NodeTypeEnum } from "./dto/NodeTypeEnum";
import assert from "assert";

@Injectable()
export class StorageService {
  private buildsFolder: string | undefined;
  constructor(configService: ConfigService) {
    this.buildsFolder = configService.get<string>(BASE_BUILDS_FOLDER);
    assert(this.buildsFolder);
  }

  getBuildFilesList(appId: string, buildId: string, relativePath: string) {
    const results: { [name: string]: FileMeta } = {};
    const cwd = `/${this.buildsFolder}/${appId}/${buildId}/${
      relativePath || ""
    }`;
    const files = sync(`*`, {
      nodir: true,
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
    return Object.values(results);
  }
}
