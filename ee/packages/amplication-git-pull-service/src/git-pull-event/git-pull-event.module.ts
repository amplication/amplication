import { Module } from "@nestjs/common";
import { GitPullEventService } from "./git-pull-event.service";
import { GitPullEventController } from "./git-pull-event.controller";
import { PrismaService } from "../prisma.service";
import { GitPullEventRepository } from "./git-pull-event.repository";
import { StorageService } from "../providers/storage/storage.service";
import { GitHostProviderService } from "../providers/git/git-host-provider.service";
import { GitClientService } from "../providers/git/git-client.service";
import { GitHostProviderFactory } from "../providers/git/git-host-provider-factory";

@Module({
  controllers: [GitPullEventController],
  providers: [
    PrismaService,
    GitPullEventService,
    GitHostProviderService,
    {
      provide: "GitHostProviderFactory",
      useClass: GitHostProviderFactory,
    },
    {
      provide: "GitClient",
      useClass: GitClientService,
    },
    {
      provide: "GitPullEventRepository",
      useClass: GitPullEventRepository,
    },
    {
      provide: "Storage",
      useClass: StorageService,
    },
  ],
  exports: [GitPullEventService],
})
export class GitPullEventModule {}
