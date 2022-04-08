import { Body, Controller, Post } from "@nestjs/common";
import { GitPullEventService } from "./gitPullEvent.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PushEventMessage } from "../../contracts/interfaces/pushEventMessage";

@Controller()
export class GitPullEventController {
  constructor(protected readonly gitPullEventService: GitPullEventService) {}

  // @MessagePattern("pull.event")
  // async processRepositoryPushEvent(@Payload() message: any) {
  //   await this.gitPullEventService.pushEventHandler({
  //     ...message.value,
  //     pushedAt: new Date(),
  //   });
  //
  //   return {
  //     key: "kafka-key",
  //     value: "items",
  //   };
  // }

  @Post("push-event")
  async processRepositoryPushEvent(@Body() message: PushEventMessage) {
    return this.gitPullEventService.pushEventHandler({
      ...message,
      pushedAt: new Date(),
    });
  }
}
