import { Module } from "@nestjs/common";
import { GitPullEventModule } from "./git-pull-event/git-pull-event.module";
import { HealthModule } from "./health/health.module";
import { SecretsManagerModule } from "./secrets/secretsManager.module";
import { ConfigModule } from "@nestjs/config";
import { RootWinstonModule } from "./winston/root-winston.module";
import { AmplicationLoggerModule } from "@amplication/nest-logger-module";

const SERVICE_NAME = "amplication-git-pull-service";

@Module({
  controllers: [],
  imports: [
    GitPullEventModule,
    HealthModule,
    SecretsManagerModule,
    AmplicationLoggerModule.register({
      metadata: { service: SERVICE_NAME },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    RootWinstonModule,
  ],
  providers: [],
})
export class AppModule {}
