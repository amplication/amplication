import { Module } from '@nestjs/common';
import { InAppNotificationService } from './inAppNotification.service';

@Module({
  imports: [],
  providers: [InAppNotificationService],
  exports: [InAppNotificationService]
})
export class InAppNotificationModule {}
