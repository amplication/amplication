import { Module } from "@nestjs/common";
import { GitPullEventService } from "./gitPullEvent.service";
import { GitPullEventController } from "./gitPullEvent.controller";
import { PrismaService } from "../../prisma.service";
import { GitPullEventRepository } from "../../repositories/gitPullEvent.repository";
import { StorageService } from "../../providers/storage/storage.service";
import { GitHostProviderService } from "../../providers/gitProvider/gitHostProvider.service";
import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { GitHostProviderFactory } from "../../utils/gitHostProviderFactory/gitHostProviderFactory";

@Module({
  controllers: [GitPullEventController],
  providers: [
    PrismaService,
    GitPullEventService,
    GitHostProviderService,
    {
      provide: "IGitHostProviderFactory",
      useClass: GitHostProviderFactory,
    },
    {
      provide: "IGitClient",
      useClass: GitClientService,
    },
    {
      provide: "IGitPullEventRepository",
      useClass: GitPullEventRepository,
    },
    {
      provide: "IStorage",
      useClass: StorageService,
    },
  ],
  exports: [GitPullEventService],
})
export class GitPullEventModule {}
