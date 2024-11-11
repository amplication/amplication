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

  @EventPattern("user-announcement.internal.1")
  notifyFeatureAnnouncement(
    @Payload() message: { [key: string]: any },
    @Ctx() context: KafkaContext
  ) {
    // validate message
    const messageTopic = context.getTopic();
    return this.appService.notificationService(message, messageTopic);
  }

  @EventPattern("user-preview-generation-completed.internal.1")
  previewUserGenerationCompleted(
    @Payload() message: { [key: string]: any },
    @Ctx() context: KafkaContext
  ) {
    // validate message
    const messageTopic = context.getTopic();
    return this.appService.notificationService(message, messageTopic);
  }

  @EventPattern("platform.internal.tech-debt.created.1")
  notifyTechDebt(
    @Payload() message: { [key: string]: any },
    @Ctx() context: KafkaContext
  ) {
    // validate message
    const messageTopic = context.getTopic();
    return this.appService.notificationService(message, messageTopic);
  }
}
