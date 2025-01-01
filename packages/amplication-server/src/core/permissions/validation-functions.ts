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
  };
};

export const VALIDATION_FUNCTIONS: Record<
  AuthorizableOriginParameter,
  (
    prisma: PrismaService,
    originId: string,
    workspaceId: string,
    user: AuthUser
  ) => Promise<boolean>
> = {
  [AuthorizableOriginParameter.WorkspaceId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => originId === workspaceId,
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
    return matching === 1;
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
    return matching === 1;
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
    return matching === 1;
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
    return matching === 1;
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
    return matching === 1;
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
    return matching === 1;
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
    return matching === 1;
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
    return matching === 1;
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
    return matching === 1;
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
    return matching === 1;
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
    return matching === 1;
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
    return matching === 1;
  },
  [AuthorizableOriginParameter.EntityFieldId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.entityField.count({
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
    });
    return matching === 1;
  },
  [AuthorizableOriginParameter.EntityPermissionFieldId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.entityPermissionField.count({
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
    });
    return matching === 1;
  },
  [AuthorizableOriginParameter.EntityId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.entity.count(
      checkByResourceParameters(originId, workspaceId)
    );
    return matching === 1;
  },
  [AuthorizableOriginParameter.BlockId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.block.count(
      checkByResourceParameters(originId, workspaceId)
    );
    return matching === 1;
  },
  [AuthorizableOriginParameter.BuildId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.build.count(
      checkByResourceParameters(originId, workspaceId)
    );
    return matching === 1;
  },
  [AuthorizableOriginParameter.ResourceVersionId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.resourceVersion.count(
      checkByResourceParameters(originId, workspaceId)
    );
    return matching === 1;
  },
  [AuthorizableOriginParameter.UserActionId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.userAction.count(
      checkByResourceParameters(originId, workspaceId)
    );
    return matching === 1;
  },
  [AuthorizableOriginParameter.ResourceRoleId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.resourceRole.count(
      checkByResourceParameters(originId, workspaceId)
    );
    return matching === 1;
  },
  [AuthorizableOriginParameter.EnvironmentId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.environment.count(
      checkByResourceParameters(originId, workspaceId)
    );
    return matching === 1;
  },
  [AuthorizableOriginParameter.OutdatedVersionAlertId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.outdatedVersionAlert.count(
      checkByResourceParameters(originId, workspaceId)
    );
    return matching === 1;
  },
  [AuthorizableOriginParameter.CommitId]: async (
    prisma: PrismaService,
    originId: string,
    workspaceId: string
  ) => {
    const matching = await prisma.commit.count({
      where: {
        id: originId,
        project: {
          deletedAt: null,
          workspaceId,
        },
      },
    });
    return matching === 1;
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
    return matching === 1;
  },
};
