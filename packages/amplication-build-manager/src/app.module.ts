import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BuildRunnerModule } from "./build-runner/build-runner.module";
import { BuildLoggerModule } from "./build-logger/build-logger.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    HealthModule,
    BuildRunnerModule,
    BuildLoggerModule,
  ],
})
export class AppModule {}
