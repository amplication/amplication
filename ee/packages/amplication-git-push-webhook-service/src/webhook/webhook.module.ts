import { Module } from '@nestjs/common';
import { GitOrganizationModule } from '../git-organization/git-organization.module';
import { QueueModule } from '../queue/queue.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [QueueModule, GitOrganizationModule],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
