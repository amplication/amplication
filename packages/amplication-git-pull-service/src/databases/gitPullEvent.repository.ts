import { GitProviderEnum } from "./../contracts/enums/gitProvider.enum";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IGitPullEventRepository } from "../contracts/interfaces/gitPullEventRepository.interface";
import { EventData } from "../contracts/interfaces/eventData";
import { CustomError } from "../errors/CustomError";
import { EnumGitPullEventStatus } from "../contracts/enums/gitPullEventStatus.enum";

@Injectable()
export class GitPullEventRepository implements IGitPullEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(eventData: EventData): Promise<{ id: bigint }> {
    try {
      return this.prisma.gitPullEvent.create({
        data: eventData,
        select: {
          id: true,
        },
      });
    } catch (err: any) {
      throw new CustomError("failed to create a new record in DB", err);
    }
  }

  async update(id: bigint, status: EnumGitPullEventStatus): Promise<boolean> {
    try {
      const updatedEvent = this.prisma.gitPullEvent.update({
        where: { id: id },
        data: { status: status },
      });

      return !!updatedEvent;
    } catch (err: any) {
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

      // @ts-ignore
      return previousReadyCommit.shift();
    } catch (err: any) {
      throw new CustomError("failed to find previous ready commit in DB", err);
    }
  }
}
