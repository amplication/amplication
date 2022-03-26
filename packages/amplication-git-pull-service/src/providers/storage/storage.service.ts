import { Injectable } from "@nestjs/common";
import { FixedSizeArray, IStorage } from "../../contracts/storage.interface";

@Injectable()
export class StorageService implements IStorage {
  baseDir = "";

  manageStorage(data: any, storage: FixedSizeArray<5, any>, baseDir: string) {
    /* TODO: read about check sum and sliding window algorithm */
  }
}
