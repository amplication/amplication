import { Module } from "@nestjs/common";
import { GitPullEventModule } from "./git-pull-event/git-pull-event.module";
import { HealthModule } from "./health/health.module";
import { ConfigModule } from "@nestjs/config";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { TracingModule } from "@amplication/util/nestjs/tracing";

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
    TracingModule.forRoot(),
  ],
  providers: [],
})
export class AppModule {}
