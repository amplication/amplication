import { Module } from "@nestjs/common";
import { GitPullEventService } from "./gitPullEvent.service";
import { GitPullEventController } from "./gitPullEvent.controller";
import { PrismaModule } from "nestjs-prisma";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";

@Module({
  imports: [PrismaModule],
  controllers: [GitPullEventController],
  providers: [GitPullEventService, GitPullEventRepository],
  exports: [GitPullEventService, PrismaModule],
})
export class GitPullEventModule {}
