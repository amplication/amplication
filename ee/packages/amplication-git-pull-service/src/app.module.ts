import { Module } from "@nestjs/common";
import { GitPullEventModule } from "./git-pull-event/git-pull-event.module";
import { HealthModule } from "./health/health.module";
import { ConfigModule } from "@nestjs/config";
import { AmplicationLoggerModule } from "@amplication/nest-logger-module";

@Module({
  controllers: [],
  imports: [
    GitPullEventModule,
    HealthModule,
    AmplicationLoggerModule.forRoot({
      serviceName: "amplication-git-pull-service",
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
  ],
  providers: [],
})
export class AppModule {}
