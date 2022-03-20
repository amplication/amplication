import { Module } from "@nestjs/common";
import { GitRepositoryPullService } from "./GitRepositoryPull.service";
import { GitRepositoryPullController } from "./GitRepositoryPull.controller";
import { PrismaModule } from "nestjs-prisma";

@Module({
  imports: [PrismaModule],
  controllers: [GitRepositoryPullController],
  providers: [GitRepositoryPullService],
  exports: [GitRepositoryPullService],
})
export class GitRepositoryPullModule {}
