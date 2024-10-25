import { Injectable } from "@nestjs/common";
import { isEmpty } from "lodash";
import { FindOneArgs } from "../../dto";
import { Team } from "../../models";
import { PrismaService } from "../../prisma";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalyticsEventType.types";
import { prepareDeletedItemName } from "../../util/softDelete";
import { TeamCreateArgs } from "./dto/TeamCreateArgs";
import { TeamFindManyArgs } from "./dto/TeamFindManyArgs";
import { UpdateTeamArgs } from "./dto/UpdateTeamArgs";

export const INVALID_TEAM_ID = "Invalid teamId";

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analytics: SegmentAnalyticsService
  ) {}

  async teams(args: TeamFindManyArgs): Promise<Team[]> {
    return this.prisma.team.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  }

  async team(args: FindOneArgs): Promise<Team> {
    return this.prisma.team.findUnique({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  }

  async createTeam(args: TeamCreateArgs): Promise<Team> {
    const team = await this.prisma.team.create({
      data: {
        ...args.data,
        workspace: {
          connect: {
            id: args.data.workspace.connect.id,
          },
        },
      },
    });
    await this.analytics.trackWithContext({
      event: EnumEventType.TeamCreate,
      properties: {
        name: team.name,
      },
    });

    return team;
  }

  async deleteTeam(args: FindOneArgs): Promise<Team> {
    const team = await this.team(args);

    if (isEmpty(team)) {
      throw new Error(INVALID_TEAM_ID);
    }

    const updatedTeam = this.prisma.team.update({
      where: args.where,
      data: {
        name: prepareDeletedItemName(team.name, team.id),
        deletedAt: new Date(),
      },
    });
    await this.analytics.trackWithContext({
      event: EnumEventType.TeamDelete,
      properties: {
        name: team.name,
      },
    });

    return updatedTeam;
  }

  async updateTeam(args: UpdateTeamArgs): Promise<Team> {
    const team = await this.prisma.team.update({
      where: { ...args.where },
      data: {
        ...args.data,
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.TeamUpdate,
      properties: {
        name: team.name,
      },
    });

    return team;
  }
}
