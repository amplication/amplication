import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable } from "@nestjs/common";
import { Prisma, PrismaService } from "../../prisma";
import {
  BaseUsageInsightsArgs,
  BlockChangesArgs,
  ParsedQueryRowResult,
  QueryRawResult,
} from "./types";
import {
  UsageInsightsResult,
  EvaluationInsights,
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
    projectIds,
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
            id: {
              in: projectIds,
            },
          },
        },
      },
      _sum: {
        linesOfCode: true,
      },
    });

    return aggregatedLoc._sum.linesOfCode ?? 0;
  }

  async countBuilds({
    startDate,
    endDate,
    projectIds,
    timeGroup,
  }: BaseUsageInsightsArgs): Promise<UsageInsights> {
    const results: QueryRawResult[] = await this.prisma.$queryRaw`
    SELECT DATE_PART('year', b."createdAt") as year, DATE_PART('month', b."createdAt") as month, DATE_PART(${timeGroup}, b."createdAt") as time_group, COUNT(b.*) AS count
    FROM "Build" b
    JOIN "Resource" r ON b."resourceId" = r."id"
    WHERE b."createdAt" >= ${startDate}
    AND b."createdAt" <= ${endDate}
    AND r."projectId" IN (${Prisma.join(projectIds)})
    GROUP BY year, month, time_group
    ORDER BY year, month, time_group;
  `;

    return {
      results: Object.values(this.translateToAnalyticsResults(results)),
    };
  }

  async countEntityChanges({
    projectIds,
    startDate,
    endDate,
    timeGroup,
  }: BaseUsageInsightsArgs): Promise<UsageInsights> {
    const results: QueryRawResult[] = await this.prisma.$queryRaw`
    SELECT DATE_PART('year', ev."updatedAt") as year, DATE_PART('month', ev."updatedAt") as month, DATE_PART(${timeGroup}, ev."updatedAt") as time_group, COUNT(ev.*) AS count
    FROM "EntityVersion" ev
    JOIN "Entity" e ON ev."entityId" = e."id"
    JOIN "Resource" r ON e."resourceId" = r."id"
    WHERE r."projectId" IN (${Prisma.join(projectIds)})
    AND ev."updatedAt" >= ${startDate} AND ev."updatedAt" <= ${endDate}
    GROUP BY year, month, time_group
    ORDER BY year, month, time_group;
  `;

    return {
      results: Object.values(this.translateToAnalyticsResults(results)),
    };
  }

  async countBlockChanges({
    projectIds,
    startDate,
    endDate,
    blockType,
    timeGroup,
  }: BlockChangesArgs): Promise<UsageInsights> {
    let results: QueryRawResult[];
    switch (blockType) {
      case EnumBlockType.ModuleAction:
        results = await this.prisma.$queryRaw`
          SELECT DATE_PART('year', bv."updatedAt") as year, DATE_PART('month', bv."updatedAt") as month, DATE_PART(${timeGroup}, bv."updatedAt") as time_group, COUNT(bv.*) AS count
          FROM "BlockVersion" bv
          JOIN "Block" b ON bv."blockId" = b."id"
          JOIN "Resource" r ON b."resourceId" = r."id"
          WHERE b."blockType" = 'ModuleAction'
          AND r."projectId" IN (${Prisma.join(projectIds)})
          AND bv."updatedAt" >= ${startDate} AND bv."updatedAt" <= ${endDate}
          GROUP BY year, month, time_group
          ORDER BY year, month, time_group;
        `;
        break;
      case EnumBlockType.PluginInstallation:
        results = await this.prisma.$queryRaw`
          SELECT DATE_PART('year', bv."updatedAt") as year, DATE_PART('month', bv."updatedAt") as month, DATE_PART('month', bv."updatedAt") as time_group, COUNT(bv.*) AS count
          FROM "BlockVersion" bv
          JOIN "Block" b ON bv."blockId" = b."id"
          JOIN "Resource" r ON b."resourceId" = r."id"
          WHERE b."blockType" = 'PluginInstallation'
          AND r."projectId" IN (${Prisma.join(projectIds)})
          AND bv."updatedAt" >= ${startDate} AND bv."updatedAt" <= ${endDate}
          GROUP BY year, month, time_group
          ORDER BY year, month, time_group;
        `;
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
  ): Promise<UsageInsightsResult> {
    const builds = await this.countBuilds(args);
    const entities = await this.countEntityChanges(args);
    const moduleActions = await this.countBlockChanges({
      ...args,
      blockType: EnumBlockType.ModuleAction,
    });
    const plugins = await this.countBlockChanges({
      ...args,
      blockType: EnumBlockType.PluginInstallation,
    });

    this.logger.debug("Usage insights result", {
      builds,
      entities,
      moduleActions,
      plugins,
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

    this.logger.debug("Evaluation insights result", {
      loc,
      timeSaved,
      costSaved,
      codeQuality,
    });

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

  private translateToAnalyticsResults(results: QueryRawResult[]) {
    if (!results) {
      return {};
    }

    this.logger.debug("translateToAnalyticsResults", { results });

    const mapMonthNumberToName = (month: number) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months[month - 1];
    };

    const parsedResults: ParsedQueryRowResult[] = results.map((result) => {
      return {
        year: result.year,
        month: mapMonthNumberToName(result.month),
        timeGroup: result.time_group,
        count: Number(result.count),
      };
    });

    return parsedResults;
  }
}
