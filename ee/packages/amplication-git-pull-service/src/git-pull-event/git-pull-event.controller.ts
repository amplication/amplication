import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { EnvironmentVariables } from "../utils/environment-variables";
import { GitPullEventService } from "./git-pull-event.service";

const KAFKA_REPOSITORY_PUSH_QUEUE = "KAFKA_REPOSITORY_PUSH_QUEUE";

@Controller()
export class GitPullEventController {
  constructor(protected readonly gitPullEventService: GitPullEventService) {}

  @MessagePattern(EnvironmentVariables.getStrict(KAFKA_REPOSITORY_PUSH_QUEUE))
  async processRepositoryPushEvent(@Payload() message: any) {
    await this.gitPullEventService.handlePushEvent(message.value);
  }
}
