import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join, normalize } from "path";
import { DEFAULT_BUILDS_FOLDER } from "../constants";
import { Env } from "../env";

@Injectable()
export class BuildPathFactory {
  private readonly buildsFolder: string;
  constructor(private readonly configService: ConfigService) {
    // absolute path to the builds folder
    const envFilePath = this.configService.get<string>(
      Env.BUILD_ARTIFACTS_BASE_FOLDER
    );
    this.buildsFolder = envFilePath
      ? normalize(envFilePath)
      : DEFAULT_BUILDS_FOLDER;
  }

  public get(resourceId: string, buildId: string) {
    return join(this.buildsFolder, resourceId, buildId);
  }
}
