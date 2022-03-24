import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import {
  EnumGitRepositoryPullStatus,
  GitPullEvent,
  IGitPullEvent,
} from "../contracts/gitPullEvent.interface";

@Injectable()
export class GitPullEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  // create(entity: GitPullEvent): GitPullEvent {
  //   const newRepo = this.prisma.gitPullEvent.create({ data: entity })
  // }
  //
  // update(status: EnumGitRepositoryPullStatus): GitPullEvent {}
  //
  // remove(id: number): GitPullEvent {}
}
