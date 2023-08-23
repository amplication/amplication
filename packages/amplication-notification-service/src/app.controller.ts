import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern("/^[a-zA-Z0-9.]+$/")
  subscribeNotification(@Payload() message) {
    // validate message

    return this.appService.notificationService(message.value);
  }
}

/// hash user to create notificationId
/// on signup => register user
/// on signin => register user
/// on build => send notification
