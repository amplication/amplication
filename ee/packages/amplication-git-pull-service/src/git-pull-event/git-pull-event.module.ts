import { PrismaModule } from "../prisma/prisma.module";
import { GitClientService } from "./git-client.service";
import { GitHostProviderService } from "./git-host-provider.service";
import { GitHostProviderFactory } from "./git-host-provider-factory";
import { GitPullEventController } from "./git-pull-event.controller";
import { GitPullEventRepository } from "./git-pull-event.repository";
import { GitPullEventService } from "./git-pull-event.service";
import { StorageService } from "./storage.service";
import { Module } from "@nestjs/common";

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
