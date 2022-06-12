import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { IGitPullEventRepository } from '../contracts/interfaces/gitPullEventRepository.interface';
import { EventData } from '../contracts/interfaces/eventData';
import { CustomError } from '../errors/CustomError';
import { EnumGitPullEventStatus } from '../contracts/enums/gitPullEventStatus.enum';
import { GitProviderEnum } from '../contracts/enums/gitProvider.enum';

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
    } catch (err) {
      throw new CustomError('failed to create a new record in DB', err);
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
      throw new CustomError('failed to create a new record in DB', err);
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
          pushedAt: 'desc',
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
