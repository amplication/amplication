import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma";
import {
  BaseUsageInsightsArgs,
  BlockChangesArgs,
  ParsedQueryRowResult,
  QueryRawResult,
} from "./types";
import {
  AnalyticsResults,
  EvaluationInsights,
  MetricsGroupedByYear,
  UsageInsights,
} from "./dtos/UsageInsights.object";
import { EnumBlockType } from "../../enums/EnumBlockType";

@Injectable()
export class UsageInsightsService {
  constructor(
    private readonly logger: AmplicationLogger,
    private readonly prisma: PrismaService
  ) {}

  async countLinesOfCode({
    workspaceId,
    projectId,
    startDate,
    endDate,
  }: BaseUsageInsightsArgs): Promise<number> {
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

    return aggregatedLoc._sum.linesOfCode ?? 0;
  }

  async countProjectBuilds({
    workspaceId,
    startDate,
    endDate,
    projectId,
  }: BaseUsageInsightsArgs): Promise<UsageInsights> {
    let results: QueryRawResult[];
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
  }: BaseUsageInsightsArgs): Promise<UsageInsights> {
    let results: QueryRawResult[];
    if (projectId) {
      results = await this.prisma.$queryRaw`
      SELECT year, time_group, SUM(count) AS total_count
      FROM (
        SELECT DATE_PART('year', e."updatedAt") AS year, DATE_PART('month', e."updatedAt") AS time_group, COUNT(*) AS count
        FROM "Entity" e
        JOIN "Resource" r ON e."resourceId" = r."id"
        WHERE r."projectId" = ${projectId}
        AND e."updatedAt" >= ${startDate} AND e."updatedAt" <= ${endDate}
        GROUP BY DATE_PART('year', e."updatedAt"), DATE_PART('month', e."updatedAt")

        UNION ALL

        SELECT DATE_PART('year', ef."updatedAt") AS year, DATE_PART('month', ef."updatedAt") AS time_group, COUNT(*) AS count
        FROM "EntityField" ef
        JOIN "EntityVersion" ev ON ef."entityVersionId" = ev."id"
        JOIN "Entity" e ON ev."entityId" = e."id"
        JOIN "Resource" r ON e."resourceId" = r."id"
        WHERE r."projectId" = ${projectId}
        AND ev."versionNumber" = '0'
        AND e."updatedAt" >= ${startDate} AND e."updatedAt" <= ${endDate}
        GROUP BY DATE_PART('year', ef."updatedAt"), DATE_PART('month', ef."updatedAt")
      ) AS combined
      GROUP BY year, time_group
      ORDER BY year, time_group;
    `;
    } else {
      results = await this.prisma.$queryRaw`
      SELECT year, time_group, SUM(count) AS total_count
      FROM (
        SELECT DATE_PART('year', e."updatedAt") AS year, DATE_PART('month', e."updatedAt") AS time_group, COUNT(*) AS count
        FROM "Entity" e
        JOIN "Resource" r ON e."resourceId" = r."id"
        JOIN "Project" p ON r."projectId" = p."id"
        WHERE p."workspaceId" = ${workspaceId}
        AND e."updatedAt" >= ${startDate} AND e."updatedAt" <= ${endDate}
        GROUP BY DATE_PART('year', e."updatedAt"), DATE_PART('month', e."updatedAt")
        
        UNION ALL

        SELECT DATE_PART('year', ef."updatedAt") AS year, DATE_PART('month', ef."updatedAt") AS time_group, COUNT(*) AS count
        FROM "EntityField" ef
        JOIN "EntityVersion" ev ON ef."entityVersionId" = ev."id"
        JOIN "Entity" e ON ev."entityId" = e."id"
        JOIN "Resource" r ON e."resourceId" = r."id"
        JOIN "Project" p ON r."projectId" = p."id"
        WHERE p."workspaceId" = ${workspaceId}
        AND ev."versionNumber" = '0'
        AND e."updatedAt" >= ${startDate} AND e."updatedAt" <= ${endDate}
        GROUP BY DATE_PART('year', ef."updatedAt"), DATE_PART('month', ef."updatedAt")
      ) AS combined
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
  }: BlockChangesArgs): Promise<UsageInsights> {
    let results: QueryRawResult[];
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
      default:
        throw new Error(`Block type ${blockType} is not supported`);
    }

    return {
      results: Object.values(this.translateToAnalyticsResults(results)),
    };
  }

  async getUsageInsights(
    args: BaseUsageInsightsArgs
  ): Promise<AnalyticsResults> {
    const builds = await this.countProjectBuilds(args);
    const entities = await this.countEntityChanges(args);
    const moduleActions = await this.countBlockChanges({
      ...args,
      blockType: EnumBlockType.ModuleAction,
    });
    const plugins = await this.countBlockChanges({
      ...args,
      blockType: EnumBlockType.PluginInstallation,
    });

    return {
      builds,
      entities,
      moduleActions,
      plugins,
    };
  }

  async getEvaluationInsights(
    args: BaseUsageInsightsArgs
  ): Promise<EvaluationInsights> {
    const loc = await this.countLinesOfCode(args);
    const timeSaved = await this.evaluateTimeSaved(loc);
    const costSaved = await this.evaluateCostSaved(loc);
    const codeQuality = await this.evaluateCodeQuality(loc);

    return {
      loc,
      timeSaved,
      costSaved,
      codeQuality,
    };
  }

  private async evaluateTimeSaved(linesOfCode: number) {
    const divisor = 10.41;
    const timeSaved = linesOfCode / divisor;
    return Math.round(timeSaved);
  }

  private async evaluateCostSaved(linesOfCode: number) {
    const multiplier = 12;
    const coastSaved = multiplier * linesOfCode;
    return Math.round(coastSaved);
  }

  private async evaluateCodeQuality(linesOfCode: number) {
    const multiplier = 14;
    const divisor = 1000;
    const bugsPrevented = (multiplier * linesOfCode) / divisor;

    return Math.round(bugsPrevented);
  }

  private translateToAnalyticsResults(
    results: QueryRawResult[]
  ): Record<string, MetricsGroupedByYear> {
    if (!results) {
      return {};
    }
    const parsedResults: ParsedQueryRowResult[] = results.map((result) => {
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
