import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { RolesPermissions } from "@amplication/util-roles-types";
import { AuthUser } from "../auth/types";
import { VALIDATION_FUNCTIONS } from "./validation-functions";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Injectable()
export class PermissionsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  async validateAccess(
    user: AuthUser,
    originType: AuthorizableOriginParameter,
    originId: string,
    requiredPermissions: RolesPermissions[] | undefined
  ): Promise<boolean> {
    const { workspace } = user;

    if (!originId && originType !== AuthorizableOriginParameter.None) {
      return false;
    }

    const validationResponse = await VALIDATION_FUNCTIONS[originType](
      this.prisma,
      originId,
      workspace.id,
      user
    );

    if (!validationResponse || !validationResponse.canAccessWorkspace) {
      return false;
    }

    return this.validatePermissions(
      user,
      requiredPermissions,
      validationResponse.requestedResourceId,
      validationResponse.requestedProjectId
    );
  }

  async validatePermissions(
    user: AuthUser,
    requiredPermissions: RolesPermissions[] | undefined,
    requestedResourceId?: string,
    requestedProjectId?: string
  ): Promise<boolean> {
    //return true if no specific permissions are required
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    //return true if user has all permissions
    if (user.permissions.includes("*")) {
      return true;
    }

    //check if the user has the required permissions on the team level
    const hasTeamLevelPermissions = this.matchPermissions(
      requiredPermissions,
      user.permissions
    );
    if (hasTeamLevelPermissions) {
      return true;
    }

    //check if the user has the required permissions on the resource level
    const hasResourceLevelPermissions =
      await this.validateTeamAssignmentPermissions(
        user,
        requiredPermissions,
        requestedResourceId,
        requestedProjectId
      );
    if (hasResourceLevelPermissions) {
      return true;
    }

    return false;
  }

  async validateTeamAssignmentPermissions(
    user: AuthUser,
    requiredPermissions: RolesPermissions[],
    requestedResourceId: string,
    requestedProjectId: string
  ) {
    const permissions = await this.getUserResourceOrProjectPermissions(
      user,
      requestedResourceId,
      requestedProjectId
    );

    return this.matchPermissions(requiredPermissions, permissions);
  }

  //This function accepts a resourceId or a projectId.
  //The resourceId can also be a project configuration resource id
  async getUserResourceOrProjectPermissions(
    user: AuthUser,
    requestedResourceId: string,
    requestedProjectId: string
  ): Promise<RolesPermissions[]> {
    const resourceIds: string[] = [];

    if (requestedProjectId) {
      const projectResource = await this.prisma.resource.findFirst({
        where: {
          projectId: requestedProjectId,
          resourceType: EnumResourceType.ProjectConfiguration,
        },
        select: {
          id: true,
        },
      });

      if (!projectResource) {
        this.logger.error(
          `Project configuration resource not found for project ${requestedProjectId}`
        );
        return [];
      }
      resourceIds.push(projectResource.id);
    }

    if (requestedResourceId) {
      const projectResource = await this.prisma.resource.findFirst({
        where: {
          project: {
            resources: {
              some: {
                id: requestedResourceId,
              },
            },
          },
          resourceType: EnumResourceType.ProjectConfiguration,
        },
        select: {
          id: true,
        },
      });
      if (!projectResource) {
        this.logger.error(
          `Project configuration resource not found for resource ${requestedResourceId}`
        );
      } else {
        resourceIds.push(projectResource.id);
      }

      resourceIds.push(requestedResourceId);
    }

    if (resourceIds.length === 0) {
      return [];
    }

    const teamAssignments = await this.prisma.teamAssignment.findMany({
      where: {
        team: {
          deletedAt: null,
          members: {
            some: {
              id: user.id,
            },
          },
        },
        resourceId: {
          in: resourceIds,
        },
      },
      select: {
        roles: {
          where: {
            deletedAt: null,
          },
          select: {
            permissions: true,
          },
        },
      },
    });

    const permissions = Array.from(
      new Set(
        teamAssignments.flatMap((assignment) =>
          assignment.roles.flatMap((role) => role.permissions)
        )
      )
    ) as RolesPermissions[];

    return permissions;
  }

  private matchPermissions(
    permissionsToMatch: string[],
    userPermissions: string[]
  ): boolean {
    return (
      userPermissions.includes("*") ||
      permissionsToMatch.some((r) => userPermissions.includes(r))
    );
  }
}
