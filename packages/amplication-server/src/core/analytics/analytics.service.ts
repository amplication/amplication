import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma";
import { BaseAnalyticsArgs, BlockChangesArgs } from "./types";

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly logger: AmplicationLogger,
    private readonly prisma: PrismaService
  ) {}

  async countLinesOfCode({
    workspaceId,
    projectId,
    startDate,
    endDate,
  }: BaseAnalyticsArgs): Promise<number> {
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
  }: BaseAnalyticsArgs): Promise<number> {
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

  async countEntityChanges({
    workspaceId,
    projectId,
    startDate,
    endDate,
  }: BaseAnalyticsArgs): Promise<number> {
    return (
      await this.prisma.entity.findMany({
        where: {
          resource: {
            project: {
              id: projectId,
              workspaceId: workspaceId,
            },
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          OR: [
            {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
            {
              updatedAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          ],
          versions: {
            every: {
              fields: {
                every: {
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  OR: [
                    {
                      createdAt: {
                        gte: startDate,
                        lte: endDate,
                      },
                    },
                    {
                      updatedAt: {
                        gte: startDate,
                        lte: endDate,
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      })
    )?.length;
  }

  async countBlockChanges({
    workspaceId,
    projectId,
    startDate,
    endDate,
    blockType,
  }: BlockChangesArgs): Promise<number> {
    return (
      await this.prisma.block.findMany({
        where: {
          blockType: blockType, // EnumBlockType.PluginInstallation, EnumBlockType.ModuleAction
          resource: {
            project: {
              id: projectId,
              workspaceId: workspaceId,
            },
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          OR: [
            {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
            {
              updatedAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          ],
        },
      })
    )?.length;
  }
}
