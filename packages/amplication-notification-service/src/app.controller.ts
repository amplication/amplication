import { Controller } from "@nestjs/common";
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern("user-action.internal.1")
  subscribeNotification(
    @Payload() message: { [key: string]: any },
    @Ctx() context: KafkaContext
  ) {
    // validate message
    const messageTopic = context.getTopic();
    return this.appService.notificationService(message, messageTopic);
  }

  @EventPattern("user-build.internal.1")
  notifyBuild(
    @Payload() message: { [key: string]: any },
    @Ctx() context: KafkaContext
  ) {
    // validate message
    const messageTopic = context.getTopic();
    return this.appService.notificationService(message, messageTopic);
  }
}
