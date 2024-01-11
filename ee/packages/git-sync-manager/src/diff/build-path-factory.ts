import { Env } from "../env";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join, normalize } from "path";

@Injectable()
export class BuildPathFactory {
  private readonly buildsFolder: string;
  constructor(private readonly configService: ConfigService) {
    this.buildsFolder = normalize(
      this.configService.get<string>(Env.BUILD_ARTIFACTS_BASE_FOLDER)
    );
  }

  public get(resourceId: string, buildId: string) {
    return join(this.buildsFolder, resourceId, buildId);
  }
}
