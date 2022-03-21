import { Module } from "@nestjs/common";
import { GitRepositoryPullService } from "./gitRepositoryPull.service";
import { GitRepositoryPullController } from "./gitRepositoryPull.controller";
import { PrismaModule } from "nestjs-prisma";

@Module({
  imports: [PrismaModule],
  controllers: [GitRepositoryPullController],
  providers: [GitRepositoryPullService],
  exports: [GitRepositoryPullService],
})
export class GitRepositoryPullModule {}
