import { Module } from "@nestjs/common";
import { GitHubRepositoryModuleBase } from "./base/gitHubRepository.module.base";
import { GitHubRepositoryService } from "./gitHubRepository.service";
import { GitHubRepositoryController } from "./gitHubRepository.controller";
import { GitHubRepositoryResolver } from "./gitHubRepository.resolver";

@Module({
  imports: [GitHubRepositoryModuleBase],
  controllers: [GitHubRepositoryController],
  providers: [GitHubRepositoryService, GitHubRepositoryResolver],
  exports: [GitHubRepositoryService],
})
export class GitHubRepositoryModule {}
