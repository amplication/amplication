import { Injectable } from "@nestjs/common";
import { IStorage } from "../../contracts/interfaces/storage.interface";
import * as fse from "fs-extra";
import fs from "fs";
import { CustomError } from "../../errors/CustomError";

@Injectable()
export class StorageService implements IStorage {
  async copyDir(srcDir: string, destDir: string): Promise<void> {
    try {
      await fse.copy(srcDir, destDir);
    } catch (err: any) {
      throw new CustomError("failed to copy files from srcDir to destDir", err);
    }
  }

  deleteDir(dir: string): void {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
