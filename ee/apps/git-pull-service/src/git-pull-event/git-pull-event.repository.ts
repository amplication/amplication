import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  EventData,
  GitPullEventStatusEnum,
  GitProviderEnum,
} from "./git-pull-event.types";

@Injectable()
export class GitPullEventRepository {
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
      throw new Error(`failed to create a new record in DB: ${err}`);
    }
  }

  async update(id: bigint, status: GitPullEventStatusEnum): Promise<boolean> {
    try {
      const updatedEvent = await this.prisma.gitPullEvent.update({
        where: { id: id },
        data: { status: status },
      });

      return updatedEvent.status === GitPullEventStatusEnum.Ready;
    } catch (err) {
      throw new Error(`failed to create a new record in DB: ${err}`);
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
          status: GitPullEventStatusEnum.Ready,
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
      throw new Error(`failed to find previous ready commit in DB: ${err}`);
    }
  }
}
