import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiffModule } from "./diff/diff.module";
import { PullRequestModule } from "./pull-request/pull-request.module";
import { Logger } from "@amplication/util/logging";
import { Env } from "./env";

@Module({
  imports: [
    DiffModule,
    PullRequestModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    AmplicationLoggerModule.forRoot({
      serviceName: Env.SERVICE_NAME,
    }),
  ],
})
export class AppModule implements OnApplicationShutdown {
  onApplicationShutdown(signal: string) {
    new Logger({ serviceName: Env.SERVICE_NAME, isProduction: true }).debug(
      `Application shut down (signal: ${signal})`
    );
  }
}
