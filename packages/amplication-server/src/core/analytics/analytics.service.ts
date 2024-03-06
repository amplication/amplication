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
