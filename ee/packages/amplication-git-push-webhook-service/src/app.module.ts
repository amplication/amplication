import { GitOrganizationModule } from './git-organization/git-organization.module';
import { HealthModule } from './health/health.module';
import { QueueModule } from './queue/queue.module';
import { WebhookModule } from './webhook/webhook.module';
import { AmplicationLoggerModule } from '@amplication/util/nestjs/logging';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AmplicationLoggerModule.forRoot({
      component: 'amplication-git-pull-service',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    QueueModule,
    GitOrganizationModule,
    WebhookModule,
    HealthModule,
  ],
})
export class AppModule {}
