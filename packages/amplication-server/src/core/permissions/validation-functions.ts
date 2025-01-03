import { PrismaService } from "../../prisma/prisma.service";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { AuthUser } from "../auth/types";

const checkByResourceParameters = (originId: string, workspaceId: string) => {
  return {
    where: {
      id: originId,
      resource: {
        deletedAt: null,
        project: {
          workspace: {
            id: workspaceId,
          },
        },
      },
    },
    select: {
      resourceId: true,
    },
  };
};

export type ValidationResponse = {
  canAccessWorkspace: boolean;
  requestedProjectId?: string;
  requestedResourceId?: string;
};

export const VALIDATION_FUNCTIONS: Record<
  AuthorizableOriginParameter,
  (
    prisma: PrismaService,
    originId: string,
    workspaceId: string,
    user: AuthUser
  ) => Promise<ValidationResponse>
> = {
  [AuthorizableOriginParameter.None]: async () => {
    return { canAccessWorkspace: true };
  },
  [AuthorizableOriginParameter.WorkspaceId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    return {
      canAccessWorkspace: originId === workspaceId,
    };
  },
  [AuthorizableOriginParameter.GitOrganizationId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.gitOrganization.count({
      where: {
        id: originId,
        workspace: {
          id: workspaceId,
        },
      },
    });
    return { canAccessWorkspace: matching === 1 };
  },
  [AuthorizableOriginParameter.GitRepositoryId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.gitRepository.count({
      where: {
        id: originId,
      },
    });
    return { canAccessWorkspace: matching === 1 };
  },
  [AuthorizableOriginParameter.ProjectId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.project.count({
      where: {
        deletedAt: null,
        id: originId,
        workspace: {
          id: workspaceId,
        },
      },
    });
    return {
      canAccessWorkspace: matching === 1,
      requestedProjectId: originId,
    };
  },
  [AuthorizableOriginParameter.TeamId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.team.count({
      where: {
        deletedAt: null,
        id: originId,
        workspace: {
          id: workspaceId,
        },
      },
    });
    return { canAccessWorkspace: matching === 1 };
  },
  [AuthorizableOriginParameter.CustomPropertyId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.customProperty.count({
      where: {
        deletedAt: null,
        id: originId,
        workspace: {
          id: workspaceId,
        },
      },
    });
    return { canAccessWorkspace: matching === 1 };
  },
  [AuthorizableOriginParameter.RoleId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.role.count({
      where: {
        deletedAt: null,
        id: originId,
        workspace: {
          id: workspaceId,
        },
      },
    });
    return { canAccessWorkspace: matching === 1 };
  },
  [AuthorizableOriginParameter.BlueprintId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.blueprint.count({
      where: {
        deletedAt: null,
        id: originId,
        workspace: {
          id: workspaceId,
        },
      },
    });
    return { canAccessWorkspace: matching === 1 };
  },
  [AuthorizableOriginParameter.ResourceId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.resource.count({
      where: {
        deletedAt: null,
        archived: { not: true },
        id: originId,
        project: {
          workspace: {
            id: workspaceId,
          },
        },
      },
    });
    return {
      canAccessWorkspace: matching === 1,
      requestedResourceId: originId,
    };
  },
  [AuthorizableOriginParameter.InvitationId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.invitation.count({
      where: {
        id: originId,
        workspace: {
          id: workspaceId,
        },
      },
    });
    return { canAccessWorkspace: matching === 1 };
  },
  [AuthorizableOriginParameter.ApiTokenId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string,
    user: AuthUser
  ) => {
    const matching = await prisma.apiToken.count({
      where: {
        id: originId,
        userId: user.id,
      },
    });
    return { canAccessWorkspace: matching === 1 };
  },
  [AuthorizableOriginParameter.ActionId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.action.count({
      where: {
        // eslint-disable-next-line  @typescript-eslint/naming-convention
        OR: [
          {
            id: originId,
            deployments: {
              some: {
                build: {
                  resource: {
                    deletedAt: null,
                    project: {
                      workspaceId: workspaceId,
                    },
                  },
                },
              },
            },
          },
          {
            id: originId,
            builds: {
              some: {
                resource: {
                  deletedAt: null,
                  project: {
                    workspaceId: workspaceId,
                  },
                },
              },
            },
          },
          {
            id: originId,
            userAction: {
              some: {
                resource: {
                  deletedAt: null,
                  project: {
                    workspaceId: workspaceId,
                  },
                },
              },
            },
          },
        ],
      },
    });
    return { canAccessWorkspace: matching === 1 };
  },
  [AuthorizableOriginParameter.DeploymentId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.deployment.count({
      where: {
        id: originId,
        environment: {
          resource: {
            deletedAt: null,
            project: {
              workspaceId,
            },
          },
        },
      },
    });
    return { canAccessWorkspace: matching === 1 };
  },
  [AuthorizableOriginParameter.EntityFieldId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.entityField.findFirst({
      where: {
        id: originId,
        entityVersion: {
          entity: {
            resource: {
              deletedAt: null,
              project: {
                workspaceId,
              },
            },
          },
        },
      },
      select: {
        entityVersion: {
          select: {
            entity: {
              select: {
                resourceId: true,
              },
            },
          },
        },
      },
    });

    return {
      canAccessWorkspace: matching !== null,
      requestedResourceId: matching?.entityVersion?.entity?.resourceId,
    };
  },
  [AuthorizableOriginParameter.EntityPermissionFieldId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.entityPermissionField.findFirst({
      where: {
        id: originId,
        field: {
          entityVersion: {
            entity: {
              resource: {
                deletedAt: null,
                project: {
                  workspaceId,
                },
              },
            },
          },
        },
      },
      select: {
        field: {
          select: {
            entityVersion: {
              select: {
                entity: {
                  select: {
                    resourceId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      canAccessWorkspace: matching !== null,
      requestedResourceId: matching?.field?.entityVersion?.entity?.resourceId,
    };
  },
  [AuthorizableOriginParameter.EntityId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.entity.findFirst(
      checkByResourceParameters(originId, workspaceId)
    );
    return {
      canAccessWorkspace: matching !== null,
      requestedResourceId: matching.resourceId,
    };
  },
  [AuthorizableOriginParameter.BlockId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.block.findFirst(
      checkByResourceParameters(originId, workspaceId)
    );
    return {
      canAccessWorkspace: matching !== null,
      requestedResourceId: matching.resourceId,
    };
  },
  [AuthorizableOriginParameter.BuildId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.build.findFirst(
      checkByResourceParameters(originId, workspaceId)
    );
    return {
      canAccessWorkspace: matching !== null,
      requestedResourceId: matching.resourceId,
    };
  },
  [AuthorizableOriginParameter.ResourceVersionId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.resourceVersion.findFirst(
      checkByResourceParameters(originId, workspaceId)
    );
    return {
      canAccessWorkspace: matching !== null,
      requestedResourceId: matching.resourceId,
    };
  },
  [AuthorizableOriginParameter.UserActionId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.userAction.findFirst(
      checkByResourceParameters(originId, workspaceId)
    );
    return {
      canAccessWorkspace: matching !== null,
      requestedResourceId: matching.resourceId,
    };
  },
  [AuthorizableOriginParameter.ResourceRoleId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.resourceRole.findFirst(
      checkByResourceParameters(originId, workspaceId)
    );
    return {
      canAccessWorkspace: matching !== null,
      requestedResourceId: matching.resourceId,
    };
  },
  [AuthorizableOriginParameter.EnvironmentId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.environment.findFirst(
      checkByResourceParameters(originId, workspaceId)
    );
    return {
      canAccessWorkspace: matching !== null,
      requestedResourceId: matching.resourceId,
    };
  },
  [AuthorizableOriginParameter.OutdatedVersionAlertId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.outdatedVersionAlert.findFirst(
      checkByResourceParameters(originId, workspaceId)
    );
    return {
      canAccessWorkspace: matching !== null,
      requestedResourceId: matching.resourceId,
    };
  },
  [AuthorizableOriginParameter.CommitId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.commit.findFirst({
      where: {
        id: originId,
        project: {
          deletedAt: null,
          workspaceId,
        },
      },
      select: {
        projectId: true,
      },
    });
    return {
      canAccessWorkspace: matching !== null,
      requestedProjectId: matching?.projectId,
    };
  },
  [AuthorizableOriginParameter.UserId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.user.count({
      where: {
        id: originId,
        workspace: {
          id: workspaceId,
        },
      },
    });
    return { canAccessWorkspace: matching === 1 };
  },
};
