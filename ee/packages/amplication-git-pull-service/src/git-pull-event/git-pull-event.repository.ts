import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import {
  EventData,
  GitPullEventRepository as GitPullEventRepositoryInterface,
} from "../interfaces";
import { CustomError } from "../errors/custom-error";
import { EnumGitPullEventStatus, GitProviderEnum } from "../enums";

@Injectable()
export class GitPullEventRepository implements GitPullEventRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(eventData: EventData): Promise<{ id: bigint }> {
    try {
      return this.prisma.gitPullEvent.create({
        data: eventData,
        select: {
          id: true,
        },
      });
    } catch (err) {
      throw new CustomError("failed to create a new record in DB", err);
    }
  }

  async update(id: bigint, status: EnumGitPullEventStatus): Promise<boolean> {
    try {
      const updatedEvent = await this.prisma.gitPullEvent.update({
        where: { id: id },
        data: { status: status },
      });

      return updatedEvent.status === EnumGitPullEventStatus.Ready;
    } catch (err) {
      throw new CustomError("failed to create a new record in DB", err);
    }
  }

  async findByPreviousReadyCommit(
    provider: keyof typeof GitProviderEnum,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    pushedAt: Date,
    skip: number
  ): Promise<EventData | undefined> {
    try {
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
      throw new CustomError("failed to find previous ready commit in DB", err);
    }
  }
}
