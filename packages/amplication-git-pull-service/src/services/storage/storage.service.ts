import { Injectable } from "@nestjs/common";
import { IStorage } from "../../contracts/storage.interface";

@Injectable()
export class StorageService implements IStorage {
  workDir = '';

  manageStorage() {

  }
}