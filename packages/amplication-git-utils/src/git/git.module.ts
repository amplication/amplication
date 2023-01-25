import { AmplicationLoggerModule } from "@amplication/nest-logger-module";
import { Module } from "@nestjs/common";
import { GitService } from "./git.service";
import { GitServiceFactory } from "./git-service-factory";
import { ConfigModule } from "@nestjs/config";
import { GithubService } from "./github.service";
import { SERVICE_NAME } from "./git.constants";

@Module({
  imports: [
    ConfigModule,
    AmplicationLoggerModule.register({
      metadata: { service: SERVICE_NAME },
    }),
  ],
  providers: [GitService, GitServiceFactory, GithubService],
  exports: [GitService, GitServiceFactory, GithubService],
})
export class GitModule {}
