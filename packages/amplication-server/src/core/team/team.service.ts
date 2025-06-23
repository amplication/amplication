import { Injectable } from "@nestjs/common";
import { isEmpty } from "lodash";
import { FindOneArgs } from "../../dto";
import { Role, Team, User } from "../../models";
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
import { AddRolesToTeamArgs } from "./dto/AddRolesToTeamArgs";
import { RemoveRolesFromTeamArgs } from "./dto/RemoveRolesFromTeamArgs";
import { AddRolesToTeamAssignmentArgs } from "./dto/AddRolesToTeamAssignmentArgs";
import { TeamAssignment } from "../../models/TeamAssignment";
import { RemoveRolesFromTeamAssignmentArgs } from "./dto/RemoveRolesFromTeamAssignmentArgs";
import { DeleteTeamAssignmentArgs } from "./dto/DeleteTeamAssignmentArgs";
import { WhereTeamAssignmentInput } from "./dto/WhereTeamAssignmentInput";
import { CreateTeamAssignmentsArgs } from "./dto/CreateTeamAssignmentsArgs";
import { AddMemberToTeamsArgs } from "./dto/AddMemberToTeamsArgs";

export const INVALID_TEAM_ID = "Invalid teamId";
export const INVALID_USER_ID = "Invalid userId";
export const INVALID_MEMBERS = "Invalid members";
export const INVALID_RESOURCE_ID = "Invalid resourceId";
export const INVALID_ROLES = "Invalid roles";
export const INVALID_TEAMS = "Invalid teams";

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

  async addMemberToTeams(args: AddMemberToTeamsArgs): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: args.where.id,
      },
    });

    if (!user) {
      throw new AmplicationError(INVALID_USER_ID);
    }

    const teamIds = args.data.teamIds;

    const invalidTeams = await this.prisma.team.findMany({
      where: {
        id: {
          in: teamIds,
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
              not: user.workspaceId,
            },
          },
        ],
      },
    });

    if (invalidTeams && invalidTeams.length > 0) {
      throw new AmplicationError(INVALID_TEAMS);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: args.where.id,
      },
      data: {
        teams: {
          connect: teamIds.map((teamId) => ({
            id: teamId,
          })),
        },
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.TeamAddMembers,
      properties: {
        teamName: "multiple teams",
        membersAdded: teamIds.length,
      },
    });

    return updatedUser;
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
    const team = await this.prisma.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        members: true,
      },
    });
    return team?.members || [];
  }

  async addRolesToTeam(args: AddRolesToTeamArgs): Promise<Team> {
    const team = await this.prisma.team.findUnique({
      where: {
        id: args.where.id,
      },
    });

    if (!team) {
      throw new AmplicationError(INVALID_TEAM_ID);
    }

    const roleIds = args.data.roleIds;

    await this.validateRoles(args.where.id, team.workspaceId, roleIds);

    const updatedTeam = await this.prisma.team.update({
      where: {
        id: args.where.id,
      },
      data: {
        roles: {
          connect: roleIds.map((roleId) => ({
            id: roleId,
          })),
        },
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.TeamAddRoles,
      properties: {
        teamName: team.name,
        rolesAdded: roleIds.length,
      },
    });

    return updatedTeam;
  }

  async validateRoles(
    teamId: string,
    workspaceId: string,
    roleIds: string[]
  ): Promise<void> {
    const invalidRoles = await this.prisma.role.findMany({
      where: {
        id: {
          in: roleIds,
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
              not: workspaceId,
            },
          },
        ],
      },
    });

    if (invalidRoles && invalidRoles.length > 0) {
      throw new AmplicationError(INVALID_ROLES);
    }
  }

  async validateTeams(resourceId: string, teamIds: string[]): Promise<void> {
    const resource = await this.prisma.resource.findUnique({
      where: {
        id: resourceId,
      },
      select: {
        project: {
          select: {
            workspaceId: true,
          },
        },
      },
    });

    if (!resource) {
      throw new AmplicationError(INVALID_RESOURCE_ID);
    }

    const workspaceId = resource.project.workspaceId;

    const invalidTeams = await this.prisma.team.findMany({
      where: {
        id: {
          in: teamIds,
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
              not: workspaceId,
            },
          },
        ],
      },
    });

    if (invalidTeams && invalidTeams.length > 0) {
      throw new AmplicationError(INVALID_TEAMS);
    }
  }

  async removeRolesFromTeam(args: RemoveRolesFromTeamArgs): Promise<Team> {
    const team = await this.prisma.team.findUnique({
      where: {
        id: args.where.id,
      },
    });

    if (!team) {
      throw new AmplicationError(INVALID_TEAM_ID);
    }

    const roleIds = args.data.roleIds;

    const updatedTeam = await this.prisma.team.update({
      where: {
        id: args.where.id,
      },
      data: {
        roles: {
          disconnect: roleIds.map((roleId) => ({
            id: roleId,
          })),
        },
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.TeamRemoveRoles,
      properties: {
        teamName: team.name,
        rolesRemoved: roleIds.length,
      },
    });

    return updatedTeam;
  }

  async roles(teamId: string): Promise<Role[]> {
    const team = await this.prisma.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        roles: true,
      },
    });
    return team?.roles || [];
  }

  async addRolesToTeamAssignment(
    args: AddRolesToTeamAssignmentArgs,
    user: User
  ): Promise<TeamAssignment> {
    const {
      data,
      where: { teamId, resourceId },
    } = args;

    await this.validateAssignmentTeam(teamId, user);

    //check if team is already assigned to the resource
    const teamAssignment = await this.prisma.teamAssignment.upsert({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        teamId_resourceId: {
          teamId,
          resourceId,
        },
      },
      update: {},
      create: {
        teamId,
        resourceId,
      },
      include: {
        team: true,
      },
    });

    const roleIds = data.roleIds;

    if (roleIds.length === 0) {
      return teamAssignment;
    }

    await this.validateRoles(
      teamAssignment.teamId,
      teamAssignment.team.workspaceId,
      roleIds
    );

    const updatedTeamAssignment = await this.prisma.teamAssignment.update({
      where: {
        id: teamAssignment.id,
      },
      data: {
        roles: {
          connect: roleIds.map((roleId) => ({
            id: roleId,
          })),
        },
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.TeamAssignmentAddRoles,
      properties: {
        teamName: teamAssignment.team.name,
        rolesAdded: roleIds.length,
        resourceId: teamAssignment.resourceId,
      },
    });

    return updatedTeamAssignment;
  }

  async removeRolesFromTeamAssignment(
    args: RemoveRolesFromTeamAssignmentArgs
  ): Promise<TeamAssignment> {
    const {
      data,
      where: { teamId, resourceId },
    } = args;

    //check if team is already assigned to the resource
    const teamAssignment = await this.prisma.teamAssignment.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        teamId_resourceId: {
          teamId,
          resourceId,
        },
      },
      include: {
        team: true,
      },
    });
    if (!teamAssignment) {
      throw new AmplicationError(INVALID_TEAM_ID);
    }

    const roleIds = data.roleIds;

    const updatedTeamAssignment = await this.prisma.teamAssignment.update({
      where: {
        id: teamAssignment.id,
      },
      data: {
        roles: {
          disconnect: roleIds.map((roleId) => ({
            id: roleId,
          })),
        },
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.TeamAssignmentRemoveRoles,
      properties: {
        teamName: teamAssignment.team.name,
        rolesRemoved: roleIds.length,
        resourceId: teamAssignment.resourceId,
      },
    });

    return updatedTeamAssignment;
  }

  async deleteTeamAssignment(
    args: DeleteTeamAssignmentArgs
  ): Promise<TeamAssignment> {
    const {
      where: { teamId, resourceId },
    } = args;

    //check if team is already assigned to the resource
    const teamAssignment = await this.prisma.teamAssignment.delete({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        teamId_resourceId: {
          teamId,
          resourceId,
        },
      },
      include: {
        team: true,
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.TeamDeleteAssignment,
      properties: {
        teamId: teamAssignment.teamId,
        resourceId: teamAssignment.resourceId,
      },
    });

    return teamAssignment;
  }

  async createTeamAssignments(
    args: CreateTeamAssignmentsArgs
  ): Promise<TeamAssignment[]> {
    const { where, data } = args;

    await this.validateTeams(args.where.resourceId, args.data.teamIds);

    const promises = data.teamIds.map(async (team) => {
      return this.prisma.teamAssignment.upsert({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          teamId_resourceId: {
            teamId: team,
            resourceId: where.resourceId,
          },
        },
        update: {},
        create: {
          teamId: team,
          resourceId: where.resourceId,
        },
        include: {
          team: true,
        },
      });
    });

    const teamAssignments = await Promise.all(promises);

    return teamAssignments;
  }

  async validateAssignmentTeam(teamId: string, user: User) {
    const team = await this.prisma.team.findUnique({
      where: {
        id: teamId,
        deletedAt: null,
        workspaceId: user.workspace.id,
      },
    });

    if (!team) {
      throw new AmplicationError(INVALID_TEAM_ID);
    }
  }

  async getTeamAssignmentRoles(args: WhereTeamAssignmentInput) {
    const teamAssignment = await this.prisma.teamAssignment.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        teamId_resourceId: {
          teamId: args.teamId,
          resourceId: args.resourceId,
        },
      },
      include: {
        roles: true,
      },
    });
    return teamAssignment?.roles || [];
  }
}
