import { Controller } from "@nestjs/common";
import { GitPullEventService } from "./gitPullEvent.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PushEventMessage } from "../../contracts/interfaces/pushEventMessage";

@Controller("gitRepositoriesPull")
export class GitPullEventController {
  constructor(protected readonly gitPullEventService: GitPullEventService) {}

  @MessagePattern("")
  async processRepositoryPushEvent(@Payload() message: PushEventMessage) {
    await this.gitPullEventService.pushEventHandler(message);

    return {
      key: 'kafka-key',
      value: 'items',
    }
  }
}
