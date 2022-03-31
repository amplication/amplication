import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IDatabaseOperations } from "../contracts/interfaces/databaseOperations.interface";
import { EnumGitPullEventStatus } from "../contracts/enums/gitPullEventStatus";
import { EventData } from "../contracts/interfaces/eventData";
import { CustomError } from "../errors/CustomError";

@Injectable()
export class GitPullEventRepository implements IDatabaseOperations {
  constructor(private readonly prisma: PrismaService) {}

  async create(eventData: EventData): Promise<EventData> {
    try {
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
    } catch (err) {
      throw new CustomError('failed to create a new record in DB', err);
    }
  }

  async update(
    id: bigint,
    status: EnumGitPullEventStatus
  ): Promise<EventData> {
    try {
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
    } catch (err) {
      throw new CustomError('failed to create a new record in DB', err);
    }
  }

  async getPreviousReadyCommit(
    eventData: EventData,
    skip: number,
  ): Promise<EventData | undefined> {
    try {
      const { provider, repositoryOwner, repositoryName, branch, pushedAt } = eventData;
      const previousReadyCommit = await this.prisma.gitPullEvent.findMany({
          where: {
            provider: provider,
            repositoryOwner: repositoryOwner,
            repositoryName: repositoryName,
            branch: branch,
            status: EnumGitPullEventStatus.Ready,
            pushedAt: {
              lt: pushedAt,
            },
          },
          orderBy: {
            pushedAt: "desc",
          },
          skip: skip,
          take: 1,
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

      return previousReadyCommit.shift();
    } catch (err) {
      throw new CustomError('failed to find previous ready commit in DB', err);
    }
  }
}
