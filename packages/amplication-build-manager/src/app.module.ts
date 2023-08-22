import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BuildRunnerModule } from "./build-runner/build-runner.module";
import { BuildLoggerModule } from "./build-logger/build-logger.module";
import { HealthModule } from "./health/health.module";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { Env } from "./env";
import { TracingModule } from "@amplication/util/nestjs/tracing";
import { ControllerInjector } from "@amplication/opentelemetry-nestjs";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    AmplicationLoggerModule.forRoot({
      component: Env.SERVICE_NAME,
    }),
    TracingModule.forRoot({
      serviceName: Env.SERVICE_NAME,
      traceAutoInjectors: [ControllerInjector],
    }),
    HealthModule,
    BuildRunnerModule,
    BuildLoggerModule,
  ],
})
export class AppModule {}
