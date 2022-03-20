import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { GitHubRepositoryServiceBase } from "./base/gitHubRepository.service.base";

@Injectable()
export class GitHubRepositoryService extends GitHubRepositoryServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
