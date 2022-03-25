import { Module } from "@nestjs/common";
import { GitRepositoryPullService } from "./gitRepositoryPull.service";
import { GitRepositoryPullController } from "./gitRepositoryPull.controller";
import { PrismaModule } from "nestjs-prisma";
import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { GitProviderService } from "../../providers/git/gitProvider.service";
import { GitPullEventRepository } from "../../database/gitPullEvent.repository";

@Module({
  imports: [PrismaModule],
  controllers: [GitRepositoryPullController],
  providers: [GitRepositoryPullService, GitClientService, GitProviderService, GitPullEventRepository],
  exports: [GitRepositoryPullService, PrismaModule],
})
export class GitRepositoryPullModule {}
