import { GitPullEventModule } from "./git-pull-event/git-pull-event.module";
import { HealthModule } from "./health/health.module";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  controllers: [],
  imports: [
    GitPullEventModule,
    HealthModule,
    AmplicationLoggerModule.forRoot({
      component: "amplication-git-pull-service",
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
  ],
  providers: [],
})
export class AppModule {}
