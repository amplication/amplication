import { Module } from "@nestjs/common";
import { GitPullEventModule } from "./git-pull-event/git-pull-event.module";
import { HealthModule } from "./health/health.module";
import { SecretsManagerModule } from "./secrets/secretsManager.module";
import { MorganModule } from "nest-morgan";
import { ConfigModule } from "@nestjs/config";
import { RootWinstonModule } from "./winston/root-winston.module";

@Module({
  controllers: [],
  imports: [
    GitPullEventModule,
    HealthModule,
    SecretsManagerModule,
    MorganModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    RootWinstonModule,
  ],
  providers: [],
})
export class AppModule {}
