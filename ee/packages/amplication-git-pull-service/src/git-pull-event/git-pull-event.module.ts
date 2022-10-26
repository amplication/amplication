import { Module } from "@nestjs/common";
import { GitPullEventService } from "./git-pull-event.service";
import { GitPullEventController } from "./git-pull-event.controller";
import { GitPullEventRepository } from "./git-pull-event.repository";
import { StorageService } from "./storage.service";
import { GitHostProviderService } from "./git-host-provider.service";
import { GitClientService } from "./git-client.service";
import { GitHostProviderFactory } from "./git-host-provider-factory";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [GitPullEventController],
  providers: [
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
