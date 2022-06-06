import { EnvironmentVariables } from "./../../services/environmentVariables";
import { Body, Controller } from "@nestjs/common";
import { GitPullEventService } from "./gitPullEvent.service";
import { MessagePattern, Payload } from "@nestjs/microservices";

const KAFKA_TOPIC_NAME_KEY = "KAFKA_TOPIC";

@Controller()
export class GitPullEventController {
  constructor(protected readonly gitPullEventService: GitPullEventService) {}

  @MessagePattern(EnvironmentVariables.getStrict(KAFKA_TOPIC_NAME_KEY))
  async processRepositoryPushEvent(@Payload() message: any) {
    await this.gitPullEventService.handlePushEvent(message.value);
  }
}
