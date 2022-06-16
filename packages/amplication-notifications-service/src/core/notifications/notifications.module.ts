import { Module } from "@nestjs/common";
import { NOTIFICATION_TOKEN } from "src/contracts/interfaces/notification.interface";
import { NotificationsController } from "./notifications.controller";
import { NotificationService } from "./notifications.service";

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [{ provide: NOTIFICATION_TOKEN, useClass: NotificationService }],
  exports: [{ provide: NOTIFICATION_TOKEN, useClass: NotificationService }],
})
export class NotificationsModule {}
