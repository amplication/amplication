import { Module } from "@nestjs/common";
import { GitPullEventService } from "./gitPullEvent.service";
import { GitPullEventController } from "./gitPullEvent.controller";
import { PrismaModule } from "nestjs-prisma";

@Module({
  imports: [PrismaModule],
  controllers: [GitPullEventController],
  providers: [GitPullEventService],
  exports: [GitPullEventService, PrismaModule],
})
export class GitPullEventModule {}
