import { Injectable } from "@nestjs/common";
import { isEmpty } from "lodash";
import { FindOneArgs } from "../../dto";
import { Team, User } from "../../models";
import { PrismaService } from "../../prisma";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalyticsEventType.types";
import { prepareDeletedItemName } from "../../util/softDelete";
import { TeamCreateArgs } from "./dto/TeamCreateArgs";
import { TeamFindManyArgs } from "./dto/TeamFindManyArgs";
import { UpdateTeamArgs } from "./dto/UpdateTeamArgs";
import { AddMembersToTeamArgs } from "./dto/AddMembersToTeamArgs";
import { AmplicationError } from "../../errors/AmplicationError";
import { RemoveMembersFromTeamArgs } from "./dto/RemoveMembersFromTeamArgs";

export const INVALID_TEAM_ID = "Invalid teamId";
export const INVALID_MEMBERS = "Invalid members";

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
      throw new AmplicationError(INVALID_TEAM_ID);
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

  async addMembersToTeam(args: AddMembersToTeamArgs): Promise<Team> {
    const team = await this.prisma.team.findUnique({
      where: {
        id: args.where.id,
      },
    });

    if (!team) {
      throw new AmplicationError(INVALID_TEAM_ID);
    }

    const userIds = args.data.userIds;

    const invalidMembers = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        OR: [
          {
            deletedAt: {
              not: null,
            },
          },
          {
            workspaceId: {
              not: team.workspaceId,
            },
          },
        ],
      },
    });

    if (invalidMembers && invalidMembers.length > 0) {
      throw new AmplicationError(INVALID_MEMBERS);
    }

    const updatedTeam = await this.prisma.team.update({
      where: {
        id: args.where.id,
      },
      data: {
        members: {
          connect: userIds.map((userId) => ({
            id: userId,
          })),
        },
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.TeamAddMembers,
      properties: {
        teamName: team.name,
        membersAdded: userIds.length,
      },
    });

    return updatedTeam;
  }

  async removeMembersFromTeam(args: RemoveMembersFromTeamArgs): Promise<Team> {
    const team = await this.prisma.team.findUnique({
      where: {
        id: args.where.id,
      },
    });

    if (!team) {
      throw new AmplicationError(INVALID_TEAM_ID);
    }

    const userIds = args.data.userIds;

    const updatedTeam = await this.prisma.team.update({
      where: {
        id: args.where.id,
      },
      data: {
        members: {
          disconnect: userIds.map((userId) => ({
            id: userId,
          })),
        },
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.TeamRemoveMembers,
      properties: {
        teamName: team.name,
        membersRemoved: userIds.length,
      },
    });

    return updatedTeam;
  }

  async members(teamId: string): Promise<User[]> {
    return this.prisma.team
      .findUnique({
        where: {
          id: teamId,
        },
      })
      .members();
  }
}
