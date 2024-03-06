import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma";
import { ProjectBuildsArgs } from "./types";

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly logger: AmplicationLogger,
    private readonly prisma: PrismaService
  ) {}

  async countLinesOfCodeAddedOrUpdatedForBuild({
    workspaceId,
    projectId,
    startDate,
    endDate,
  }: ProjectBuildsArgs): Promise<number> {
    const aggregatedLoc = await this.prisma.build.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        resource: {
          project: {
            workspaceId: workspaceId,
            id: projectId,
          },
        },
      },
      _sum: {
        linesOfCode: true,
      },
    });

    return aggregatedLoc._sum.linesOfCode;
  }

  async countProjectBuilds({
    workspaceId,
    startDate,
    endDate,
    projectId,
  }: ProjectBuildsArgs): Promise<number> {
    return (
      await this.prisma.build.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          resource: {
            project: {
              id: projectId,
              workspaceId: workspaceId,
            },
          },
        },
      })
    )?.length;
  }
}
