import { Injectable } from "@nestjs/common";
import { Storage } from "./git-pull-event.types";
import * as fse from "fs-extra";
import fs from "fs";

@Injectable()
export class StorageService implements Storage {
  async copyDir(srcDir: string, destDir: string): Promise<void> {
    try {
      await fse.copy(srcDir, destDir);
    } catch (err) {
      throw new Error(`failed to copy files from srcDir to destDir: ${err}`);
    }
  }

  deleteDir(dir: string): void {
    try {
      fs.rm(dir, { recursive: true }, (err) => {
        if (!err) {
          console.log("succeeded");
        }
      });
    } catch (err) {
      throw new Error(`failed to delete directory ${err}`);
    }
  }
}
