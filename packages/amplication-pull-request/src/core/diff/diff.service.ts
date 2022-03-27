import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { compareSync, compare, Result } from "dir-compare";
import { BUILDS_FOLDER_PATH_ENV_KEY } from "src/constants";

@Injectable()
export class DiffService {
  constructor(private readonly configService: ConfigService) {}
  async listOfChangedFiles(): Promise<[]> {
    // absolute path to the builds folder
    const buildsFolder = this.configService.get<string>(
      BUILDS_FOLDER_PATH_ENV_KEY
    );
    console.log(buildsFolder);

    // const res = await compare();
    throw new Error("");
  }
}
