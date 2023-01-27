import { AmplicationLoggerModule } from "@amplication/nest-logger-module";
import { Module } from "@nestjs/common";
import { GitFactory } from "./git-factory";
import { ConfigModule } from "@nestjs/config";
import { SERVICE_NAME } from "./git.constants";

@Module({
  imports: [
    ConfigModule,
    AmplicationLoggerModule.register({
      metadata: { service: SERVICE_NAME },
    }),
  ],
  providers: [GitFactory],
  exports: [GitFactory],
})
export class GitModule {}
