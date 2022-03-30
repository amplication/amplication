import { Injectable } from "@nestjs/common";
import { IStorage } from "../../contracts/interfaces/storage.interface";
import * as fse from "fs-extra";
import { AmplicationError } from "../../errors/AmplicationError";

@Injectable()
export class StorageService implements IStorage {
  async manageStorage(srcDir: string, destDir: string): Promise<void> {
    try {
      await fse.copy(srcDir, destDir);
      console.log("success!");
    } catch (err) {
      throw new AmplicationError(`error from StorageService => manageStorage(): ${err}`);
    }
  }
}
