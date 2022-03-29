import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IDatabaseOperations } from "../contracts/interfaces/databaseOperations.interface";
import { EnumGitPullEventStatus } from "../contracts/enums/gitPullEventStatus";
import { IGitPullEvent } from "../contracts/interfaces/gitPullEvent.interface";
import { AmplicationError } from "../errors/AmplicationError";

@Injectable()
export class GitPullEventRepository implements IDatabaseOperations {
  constructor(private readonly prisma: PrismaService) {}

  async create(eventData: IGitPullEvent): Promise<any> {
    return this.prisma.gitPullEvent.create({
      data: eventData,
      select: {
        id: true,
        provider: true,
        repositoryOwner: true,
        repositoryName: true,
        branch: true,
        commit: true,
        status: true,
        pushedAt: true,
      },
    });
  }

  async update(id: number, status: EnumGitPullEventStatus): Promise<any> {
    return this.prisma.gitPullEvent.update({
      where: { id: id },
      data: { status: status },
      select: {
        id: true,
        provider: true,
        repositoryOwner: true,
        repositoryName: true,
        branch: true,
        commit: true,
        status: true,
        pushedAt: true,
      },
    });
  }

  async getPrevReadyCommit(): Promise<any> {
    try {
      const prevReadyCommit = await this.prisma.gitPullEvent.findMany({
        where: {
          status: EnumGitPullEventStatus.Ready,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          provider: true,
          repositoryOwner: true,
          repositoryName: true,
          branch: true,
          commit: true,
        },
      });

      if (!prevReadyCommit) {
        // no prev ready commit, need to clone
        return null;
      }

      return prevReadyCommit;
    } catch (err) {
      throw new AmplicationError(
        `Error from GitPullEventRepository => getPrevReadyCommit: ${err}`
      );
    }
  }

  async getLastCommit(eventData: IGitPullEvent): Promise<any> {
    const { provider, repositoryOwner, repositoryName } = eventData;
    try {
      return this.prisma.gitPullEvent.findMany({
        take: 1,
        where: {
          provider: provider,
          repositoryOwner: repositoryOwner,
          repositoryName: repositoryName,
        },
        orderBy: {
          pushedAt: "asc",
        },
      });
    } catch (err) {
      throw new AmplicationError(
        `Error from GitPullEventRepository => getLastCommit: ${err}`
      );
    }
  }
}
