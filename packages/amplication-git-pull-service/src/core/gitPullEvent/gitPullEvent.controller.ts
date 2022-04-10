import { Body, Controller } from "@nestjs/common";
import { GitPullEventService } from "./gitPullEvent.service";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class GitPullEventController {
  constructor(protected readonly gitPullEventService: GitPullEventService) {}

  @MessagePattern("pull.event")
  async processRepositoryPushEvent(@Payload() message: any) {
    await this.gitPullEventService.pushEventHandler(message.value);
  }
}
