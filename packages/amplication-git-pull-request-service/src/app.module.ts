import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiffModule } from "./diff/diff.module";
import { PullRequestModule } from "./pull-request/pull-request.module";
import { TracingModule } from "@amplication/util/nestjs/tracing";
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
      component: Env.SERVICE_NAME,
    }),
    TracingModule.forRoot({
      serviceName: Env.SERVICE_NAME,
    }),
  ],
})
export class AppModule {}
