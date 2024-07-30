import { Module } from "@nestjs/common";
import { GitPullEventController } from "./git-pull-event.controller";
import { GitPullEventService } from "./git-pull-event.service";
import { GitPullEventRepository } from "./git-pull-event.repository";
import { GitHostProviderService } from "./git-host-provider.service";
import { StorageService } from "./storage.service";
import { GitClientService } from "./git-client.service";
import { GitHostProviderFactory } from "./git-host-provider-factory";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [GitPullEventController],
  providers: [
    GitPullEventService,
    GitHostProviderService,
    GitHostProviderFactory,
    GitClientService,
    GitPullEventRepository,
    StorageService,
  ],
  exports: [GitPullEventService],
})
export class GitPullEventModule {}
