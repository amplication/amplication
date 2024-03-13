import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma";
import {
  BaseAnalyticsArgs,
  BlockChangesArgs,
  BuildCountQueryResult,
} from "./types";
import { AnalyticsResults } from "./dtos/AnalyticsResult.object";
import { EnumBlockType } from "../../enums/EnumBlockType";

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
        linesOfCode: {
          not: null,
        },
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
  }: BaseAnalyticsArgs): Promise<AnalyticsResults> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let results: { year: number; time_group: number; count: bigint }[];
    if (projectId) {
      results = await this.prisma.$queryRaw`
      SELECT DATE_PART('year', b."createdAt") as year, DATE_PART('month', b."createdAt") as time_group, count(distinct b."id") as count
      FROM "Build" b
      JOIN "Resource" r ON b."resourceId" = r."id"
      WHERE b."createdAt" >= ${startDate}
      AND b."createdAt" <= ${endDate}
      AND r."projectId" = ${projectId}
      GROUP BY year, time_group
      ORDER BY year, time_group;
    `;
    } else {
      results = await this.prisma.$queryRaw`
      SELECT DATE_PART('year', b."createdAt") as year, DATE_PART('month', b."createdAt") as time_group, count(distinct b."id") as count
      FROM "Build" b
      JOIN "Resource" r ON b."resourceId" = r."id"
      JOIN "Project" p ON r."projectId" = p."id"
      WHERE b."createdAt" >= ${startDate}
      AND b."createdAt" <= ${endDate}
      AND p."workspaceId" = ${workspaceId} 
      GROUP BY year, time_group
      ORDER BY year, time_group;
    `;
    }

    return {
      results: Object.values(this.translateToAnalyticsResults(results)),
    };
  }

  async countEntityChanges({
    workspaceId,
    projectId,
    startDate,
    endDate,
  }: BaseAnalyticsArgs): Promise<AnalyticsResults> {
    let results;
    if (projectId) {
      results = await this.prisma.$queryRaw`
      SELECT DATE_PART('year', e."createdAt") as year, DATE_PART('month', e."createdAt") as time_group, count(distinct ef."id") as count
      FROM "Entity" e
      JOIN "Resource" r ON e."resourceId" = r."id"
      JOIN "EntityVersion" ev ON e."id" = ev."entityId"
      JOIN "EntityField" ef ON ev."id" = ef."entityVersionId"
      WHERE r."projectId" = ${projectId}
      AND ev."versionNumber" = '0'
      AND ((
          (e."createdAt" >= ${startDate} AND e."createdAt" <= ${endDate})
          OR (e."updatedAt" >= ${startDate} AND e."updatedAt" <= ${endDate})
      )
      OR (
          (ef."createdAt" >= ${startDate} AND ef."createdAt" <= ${endDate})
          OR (ef."updatedAt" >= ${startDate} AND ef."updatedAt" <= ${endDate})
      ))
      GROUP BY year, time_group
      ORDER BY year, time_group;
    `;
    } else {
      results = await this.prisma.$queryRaw`
      SELECT DATE_PART('year', e."createdAt") as year, DATE_PART('month', e."createdAt") as time_group, count(distinct ef."id") as count
      FROM "Entity" e
      JOIN "Resource" r ON e."resourceId" = r."id"
      JOIN "EntityVersion" ev ON e."id" = ev."entityId"
      JOIN "EntityField" ef ON ev."id" = ef."entityVersionId"
      JOIN "Project" p ON r."projectId" = p."id"
      WHERE p."workspaceId" = ${workspaceId}
      AND ev."versionNumber" = '0'
      AND ((
          (e."createdAt" >= ${startDate} AND e."createdAt" <= ${endDate})
          OR (e."updatedAt" >= ${startDate} AND e."updatedAt" <= ${endDate})
      )
      OR (
          (ef."createdAt" >= ${startDate} AND ef."createdAt" <= ${endDate})
          OR (ef."updatedAt" >= ${startDate} AND ef."updatedAt" <= ${endDate})
      ))
      GROUP BY year, time_group
      ORDER BY year, time_group;
    `;
    }

    return {
      results: Object.values(this.translateToAnalyticsResults(results)),
    };
  }

  async countBlockChanges({
    workspaceId,
    projectId,
    startDate,
    endDate,
    blockType,
  }: BlockChangesArgs): Promise<AnalyticsResults> {
    let results;
    this.logger.debug("blockType", { blockType });
    switch (blockType) {
      case EnumBlockType.ModuleAction:
        if (projectId) {
          results = await this.prisma.$queryRaw`
          SELECT DATE_PART('year', b."createdAt") as year, DATE_PART('month', b."createdAt") as time_group, count(distinct b."id") as count
          FROM "Block" b
          JOIN "Resource" r ON b."resourceId" = r."id"
          WHERE r."projectId" = ${projectId}
          AND b."blockType" = 'ModuleAction'
          AND (
              (b."createdAt" >= ${startDate} AND b."createdAt" <= ${endDate})
              OR (b."updatedAt" >= ${startDate} AND b."updatedAt" <= ${endDate})
          )
          GROUP BY year, time_group
          ORDER BY year, time_group;
        `;
        } else {
          results = await this.prisma.$queryRaw`
            SELECT DATE_PART('year', b."createdAt") as year, DATE_PART('month', b."createdAt") as time_group, count(distinct b."id") as count
            FROM "Block" b
            JOIN "Resource" r ON b."resourceId" = r."id"
            JOIN "Project" p ON r."projectId" = p."id"
            WHERE p."workspaceId" = ${workspaceId}
            AND b."blockType" = 'ModuleAction'
            AND (
                (b."createdAt" >= ${startDate} AND b."createdAt" <= ${endDate})
                OR (b."updatedAt" >= ${startDate} AND b."updatedAt" <= ${endDate})
            )
            GROUP BY year, time_group
            ORDER BY year, time_group;
          `;
        }
        break;
      case EnumBlockType.PluginInstallation:
        if (projectId) {
          results = await this.prisma.$queryRaw`
          SELECT DATE_PART('year', b."createdAt") as year, DATE_PART('month', b."createdAt") as time_group, count(distinct b."id") as count
          FROM "Block" b
          JOIN "Resource" r ON b."resourceId" = r."id"
          WHERE r."projectId" = ${projectId}
          AND b."blockType" = 'PluginInstallation'
          AND (
              (b."createdAt" >= ${startDate} AND b."createdAt" <= ${endDate})
              OR (b."updatedAt" >= ${startDate} AND b."updatedAt" <= ${endDate})
          )
          GROUP BY year, time_group
          ORDER BY year, time_group;
        `;
        } else {
          results = await this.prisma.$queryRaw`
          SELECT DATE_PART('year', b."createdAt") as year, DATE_PART('month', b."createdAt") as time_group, count(distinct b."id") as count
          FROM "Block" b
          JOIN "Resource" r ON b."resourceId" = r."id"
          JOIN "Project" p ON r."projectId" = p."id"
          WHERE p."workspaceId" = ${workspaceId}
          AND b."blockType" = 'PluginInstallation'
          AND (
              (b."createdAt" >= ${startDate} AND b."createdAt" <= ${endDate})
              OR (b."updatedAt" >= ${startDate} AND b."updatedAt" <= ${endDate})
          )
          GROUP BY year, time_group
          ORDER BY year, time_group;
        `;
        }
        break;
    }

    return {
      results: Object.values(this.translateToAnalyticsResults(results)),
    };
  }

  private translateToAnalyticsResults(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    results: { year: number; time_group: number; count: bigint }[]
  ) {
    const parsedResults: BuildCountQueryResult[] = results?.map((result) => {
      return {
        year: String(result.year),
        timeGroup: String(result.time_group),
        count: Number(result.count),
      };
    });

    const groupedResults = parsedResults.reduce((acc, result) => {
      const year = result.year;
      if (!acc[year]) {
        acc[year] = {
          year,
          metrics: [],
        };
      }
      acc[year].metrics.push({
        timeGroup: result.timeGroup,
        count: result.count,
      });
      return acc;
    }, {});

    this.logger.debug("groupedResults", { groupedResults });
    return groupedResults;
  }
}
