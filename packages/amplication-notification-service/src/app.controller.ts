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

  @EventPattern("/^[a-zA-Z0-9.]+$/")
  subscribeNotification(
    @Payload() message: string,
    @Ctx() context: KafkaContext
  ) {
    // validate message
    const messageTopic = context.getTopic();
    return this.appService.notificationService(message, messageTopic);
  }
}
