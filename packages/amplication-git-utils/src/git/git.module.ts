import { Module } from "@nestjs/common";
import { GitService } from "./git.service";
import { GithubService } from "./github.service";
import { GitServiceFactory } from "./git-service-factory";
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [GitService, GithubService, GitServiceFactory, ConfigService],
  exports: [GitService, GitServiceFactory, GithubService],
})
export class GitModule {}
