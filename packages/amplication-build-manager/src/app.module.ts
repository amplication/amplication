import { BuildLoggerModule } from "./build-logger/build-logger.module";
import { BuildRunnerModule } from "./build-runner/build-runner.module";
import { Env } from "./env";
import { HealthModule } from "./health/health.module";
import { ControllerInjector } from "@amplication/opentelemetry-nestjs";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { TracingModule } from "@amplication/util/nestjs/tracing";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

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
