import * as common from "@nestjs/common";
import { GitPullEventService } from "./gitPullEvent.service";
import { Body, Post } from "@nestjs/common";
import { EventData } from "../../contracts/interfaces/eventData";

@common.Controller("gitRepositoriesPull")
export class GitPullEventController {
  constructor(protected readonly service: GitPullEventService) {}

  @Post("test")
  test(@Body("eventData") eventData: EventData) {
    const { provider, repositoryOwner, repositoryName, branch, commit } =
      eventData;
    const baseDir = `git-remote/${provider}/${repositoryOwner}/${repositoryName}/${branch}/${commit}`;
    const installationId = "24226448";
    const remote = "origin";
    const skip = 0;
    return this.service.pushEventHandler(
      eventData,
      installationId,

    );
  }
}
