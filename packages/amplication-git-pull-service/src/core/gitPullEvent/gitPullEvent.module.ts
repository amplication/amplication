import { Module } from "@nestjs/common";
import { GitPullEventService } from "./gitPullEvent.service";
import { GitPullEventController } from "./gitPullEvent.controller";
import { PrismaModule } from "nestjs-prisma";
import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { GitProviderService } from "../../providers/git/gitProvider.service";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";

@Module({
  imports: [PrismaModule],
  controllers: [GitPullEventController],
  providers: [
    GitPullEventService,
    GitClientService,
    GitProviderService,
    GitPullEventRepository,
  ],
  exports: [GitPullEventService, PrismaModule],
})
export class GitPullEventModule {}
