import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { IDatabaseOperations } from "../contracts/interfaces/databaseOperations.interface";
import { EnumGitPullEventStatus } from "../contracts/enums/gitPullEventStatus.enum";
import { EventData } from "../contracts/interfaces/eventData";
import { CustomError } from "../errors/CustomError";
import { GitProviderEnum } from "../contracts/enums/gitProvider.enum";
import { ErrorMessages } from "../constants/errorMessages";

@Injectable()
export class GitPullEventRepository implements IDatabaseOperations {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    provider: keyof typeof GitProviderEnum,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    commit: string,
    status: keyof typeof EnumGitPullEventStatus,
    pushedAt: Date
  ): Promise<EventData> {
    try {
      return this.prisma.gitPullEvent.create({
        data: {
          provider,
          repositoryOwner,
          repositoryName,
          branch,
          commit,
          status,
          pushedAt,
        },
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
      throw new CustomError(ErrorMessages.CREATE_NEW_RECORD_ERROR, err);
    }
  }

  async update(id: bigint, status: EnumGitPullEventStatus): Promise<EventData> {
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
      throw new CustomError(ErrorMessages.UPDATE_RECORD_ERROR, err);
    }
  }

  async getPreviousReadyCommit(
    eventData: Partial<EventData>,
    skip: number
  ): Promise<EventData | undefined> {
    try {
      const { provider, repositoryOwner, repositoryName, branch, pushedAt } =
        eventData;
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
      throw new CustomError(ErrorMessages.PREVIOUS_READY_COMMIT_NOT_FOUND_ERROR, err);
    }
  }
}
