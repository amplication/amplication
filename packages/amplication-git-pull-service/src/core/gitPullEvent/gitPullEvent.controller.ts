import { Controller } from "@nestjs/common";
import { GitPullEventService } from "./gitPullEvent.service";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class GitPullEventController {
  constructor(protected readonly gitPullEventService: GitPullEventService) {}

  @MessagePattern("pull.event")
  async processRepositoryPushEvent(@Payload() message: any) {
    console.log({ message: message.value });
    await this.gitPullEventService.pushEventHandler({
      ...message.value,
      pushedAt: new Date(),
    });

    return {
      key: "kafka-key",
      value: "items",
    };
  }
}
