import { Module } from "@nestjs/common";
import { GitService } from "./git.service";
import { GitServiceFactory } from "./git-service-factory";

@Module({
  imports: [],
  providers: [GitService, GitServiceFactory],
  exports: [GitService, GitServiceFactory],
})
export class GitModule {}
