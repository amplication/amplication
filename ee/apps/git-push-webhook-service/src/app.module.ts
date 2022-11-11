import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { QueueModule } from "./queue/queue.module";
import { GitOrganizationModule } from "./git-organization/git-organization.module";
import { HealthModule } from "./health/health.module";
import { AmplicationLoggerModule } from "@amplication/nest-logger-module";
import { WebhookModule } from "./webhook/webhook.module";

@Module({
  imports: [
    AmplicationLoggerModule.register({
      metadata: { service: "git-pull-service" },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    QueueModule,
    GitOrganizationModule,
    WebhookModule,
    HealthModule,
  ],
})
export class AppModule {}
