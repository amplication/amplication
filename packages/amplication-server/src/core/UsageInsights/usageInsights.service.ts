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

const LOC_INFRASTRUCTURE_DISCOUNT_RATIO = 5;

@Injectable()
export class UsageInsightsService {
  constructor(
    private readonly logger: AmplicationLogger,
    private readonly prisma: PrismaService
  ) {}

  private projectIdsFilter = (projectIds: string[]) => {
    let filter = Prisma.empty;
    if (projectIds.length > 0) {
      filter = Prisma.sql`AND r."projectId" IN (${Prisma.join(projectIds)})`;
    }
    return filter;
  };

  async countLinesOfCode({
    projectIds,
    startDate,
    endDate,
  }: BaseUsageInsightsArgs): Promise<number> {
    const linesOfCodeAddedSum = await this.prisma.build.aggregate({
      where: {
        linesOfCodeAdded: {
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
        linesOfCodeAdded: true,
      },
    });

    const linesOfCodeDeletedSum = await this.prisma.build.aggregate({
      where: {
        linesOfCodeDeleted: {
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
        linesOfCodeDeleted: true,
      },
    });

    const linesOfCodeAdded = linesOfCodeAddedSum._sum.linesOfCodeAdded ?? 0;
    const linesOfCodeDeleted =
      linesOfCodeDeletedSum._sum.linesOfCodeDeleted ?? 0;

    return linesOfCodeAdded + linesOfCodeDeleted;
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
    ${this.projectIdsFilter(projectIds)}
    GROUP BY year, month, time_group
    ORDER BY year, month, time_group;
  `;

    return {
      results: Object.values(this.parseQueryRaw(results)),
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
    WHERE ev."updatedAt" >= ${startDate} AND ev."updatedAt" <= ${endDate}
    ${this.projectIdsFilter(projectIds)}
    GROUP BY year, month, time_group
    ORDER BY year, month, time_group;
  `;

    return {
      results: Object.values(this.parseQueryRaw(results)),
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

    // Prisma query raw doesn't work as expected with enums, so we use switch case instead of one query with ${blockType}
    switch (blockType) {
      case EnumBlockType.ModuleAction:
        results = await this.prisma.$queryRaw`
          SELECT DATE_PART('year', bv."updatedAt") as year, DATE_PART('month', bv."updatedAt") as month, DATE_PART(${timeGroup}, bv."updatedAt") as time_group, COUNT(bv.*) AS count
          FROM "BlockVersion" bv
          JOIN "Block" b ON bv."blockId" = b."id"
          JOIN "Resource" r ON b."resourceId" = r."id"
          WHERE b."blockType" = 'ModuleAction'
          ${this.projectIdsFilter(projectIds)}
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
          ${this.projectIdsFilter(projectIds)}
          AND bv."updatedAt" >= ${startDate} AND bv."updatedAt" <= ${endDate}
          GROUP BY year, month, time_group
          ORDER BY year, month, time_group;
        `;
        break;
      default:
        throw new Error(`Block type ${blockType} is not supported`);
    }

    return {
      results: Object.values(this.parseQueryRaw(results)),
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
    return Math.round(timeSaved / LOC_INFRASTRUCTURE_DISCOUNT_RATIO);
  }

  private async evaluateCostSaved(linesOfCode: number) {
    const multiplier = 12;
    const coastSaved = multiplier * linesOfCode;
    return Math.round(coastSaved / LOC_INFRASTRUCTURE_DISCOUNT_RATIO);
  }

  private async evaluateCodeQuality(linesOfCode: number) {
    const multiplier = 14;
    const divisor = 1000;
    const bugsPrevented = (multiplier * linesOfCode) / divisor;

    return Math.round(bugsPrevented / LOC_INFRASTRUCTURE_DISCOUNT_RATIO);
  }

  private parseQueryRaw(results: QueryRawResult[]) {
    if (!results) {
      return {};
    }

    const parsedResults: ParsedQueryRowResult[] = results.map((result) => {
      return {
        year: result.year,
        month: result.month,
        timeGroup: result.time_group,
        count: Number(result.count),
      };
    });

    return parsedResults;
  }
}
