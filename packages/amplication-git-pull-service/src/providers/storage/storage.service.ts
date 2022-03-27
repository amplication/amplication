import { Injectable } from "@nestjs/common";
import { FixedSizeArray, IStorage } from "../../contracts/storage.interface";
import { IGitPullEvent } from "../../contracts/databaseOperations.interface";

@Injectable()
export class StorageService implements IStorage {
  manageStorage(
    storage: FixedSizeArray<5, any>,
    data: IGitPullEvent,
    baseDir: string
  ) {}
}
