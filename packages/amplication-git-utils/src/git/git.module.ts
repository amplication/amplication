import { Module } from "@nestjs/common";
import { GitService } from "./git.service";
import { GitServiceFactory } from "./git-service-factory";
import { ConfigModule } from "@nestjs/config";
import { GithubService } from "./github.service";

@Module({
  imports: [ConfigModule],
  providers: [GitService, GitServiceFactory, GithubService],
})
export class GitModule {}
