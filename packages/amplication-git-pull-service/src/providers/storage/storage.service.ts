import { Injectable } from "@nestjs/common";
import { IStorage } from "../../contracts/interfaces/storage.interface";
import * as fse from "fs-extra";
import { CustomError } from "../../errors/CustomError";
import klaw from "klaw";
import path from "path";
import fs from "fs";
import { ErrorMessages } from "../../constants/errorMessages";

@Injectable()
export class StorageService implements IStorage {
  async copyDir(srcDir: string, destDir: string): Promise<void> {
    try {
      await fse.copy(srcDir, destDir);
    } catch (err) {
      throw new CustomError(ErrorMessages.COPY_DIR_FAILURE, err);
    }
  }

  // TODO: check if needed
  async removeNonCodeFiles(srcDir: string, forbiddenFilesExtension: string[]) {
    try {
      for await (const file of klaw(srcDir)) {
        for (let ext of forbiddenFilesExtension) {
          if (path.extname(file.path) === ext) {
            fs.unlinkSync(file.path);
          }
        }
      }
    } catch (err) {
      throw new CustomError(ErrorMessages.CLEAN_DIR_FAILURE, err);
    }
  }
}
