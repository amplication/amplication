import { Injectable } from "@nestjs/common";
import { promises as fs } from "fs";
import * as fse from "fs-extra";

@Injectable()
export class StorageService {
  async copyDir(srcDir: string, destDir: string): Promise<void> {
    try {
      await fse.copy(srcDir, destDir);
    } catch (err) {
      throw new Error(`failed to copy files from srcDir to destDir: ${err}`);
    }
  }

  async deleteDir(dir: string): Promise<void> {
    try {
      await fs.rm(dir, { recursive: true });
    } catch (err) {
      throw new Error(`failed to delete directory ${err}`);
    }
  }
}
