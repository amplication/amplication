import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFileSync } from "fs";
import { utimes, open } from "fs/promises";
import { sync } from "glob";
import { join } from "path";
import { BUILD_ARTIFACTS_BASE_FOLDER } from "../constants";
import { FileMeta } from "./dto/FileMeta";
import { NodeTypeEnum } from "./dto/NodeTypeEnum";

type FilesDictionary = { [name: string]: FileMeta };

@Injectable()
export class StorageService {
  private buildsFolder: string;

  constructor(
    configService: ConfigService<
      {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        BUILD_ARTIFACTS_BASE_FOLDER: string;
      },
      true
    >
  ) {
    this.buildsFolder = configService.get<string>(BUILD_ARTIFACTS_BASE_FOLDER);
  }

  getBuildFilesList(resourceId: string, buildId: string, relativePath = "") {
    const results: FilesDictionary = {};

    const cwd = join(this.buildsFolder, resourceId, buildId, relativePath);

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

  fileContent(resourceId: string, buildId: string, path = ""): string {
    const filePath = join(this.buildsFolder, resourceId, buildId, path);
    return readFileSync(filePath).toString();
  }

  async touch() {
    const filename = "file.txt";
    const time = new Date();

    await utimes(`${this.buildsFolder}/${filename}`, time, time).catch(
      async function (err) {
        if ("ENOENT" !== err.code) {
          throw err;
        }
        const fh = await open(filename, "a");
        await fh.close();
      }
    );
  }
}
