import { Injectable } from '@nestjs/common';
import { PrismaService } from '@amplication/prisma-db';
import { User } from 'src/models';
import { AuthorizableOriginParameter } from 'src/enums/AuthorizableOriginParameter';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async validateAccess(
    user: User,
    originType: AuthorizableOriginParameter,
    originId: string
  ): Promise<boolean> {
    const { workspace } = user;

    const checkByAppParameters = {
      where: {
        id: originId,
        app: {
          deletedAt: null,
          workspace: {
            id: workspace.id
          }
        }
      }
    };

    if (originType === AuthorizableOriginParameter.WorkspaceId) {
      return originId === workspace.id;
    }

    if (originType === AuthorizableOriginParameter.GitOrganizationId) {
      const matching = await this.prisma.gitOrganization.count({
        where: {
          id: originId,
          workspace: {
            id: workspace.id
          }
        }
      });
      return matching === 1;
    }

    if (originType === AuthorizableOriginParameter.GitRepositoryId) {
      const matching = await this.prisma.gitRepository.count({
        where: {
          id: originId
        }
      });
      return matching === 1;
    }

    if (originType === AuthorizableOriginParameter.AppId) {
      const matching = await this.prisma.app.count({
        where: {
          deletedAt: null,
          id: originId,
          workspace: {
            id: workspace.id
          }
        }
      });
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.InvitationId) {
      const matching = await this.prisma.invitation.count({
        where: {
          id: originId,
          workspace: {
            id: workspace.id
          }
        }
      });
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.ApiTokenId) {
      const matching = await this.prisma.apiToken.count({
        where: {
          id: originId,
          userId: user.id
        }
      });
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.ActionId) {
      const matching = await this.prisma.action.count({
        where: {
          // eslint-disable-next-line  @typescript-eslint/naming-convention
          OR: [
            {
              id: originId,
              deployments: {
                some: {
                  build: {
                    app: {
                      deletedAt: null,
                      workspaceId: workspace.id
                    }
                  }
                }
              }
            },
            {
              id: originId,
              builds: {
                some: {
                  app: {
                    deletedAt: null,
                    workspaceId: workspace.id
                  }
                }
              }
            }
          ]
        }
      });
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.DeploymentId) {
      const matching = await this.prisma.deployment.count({
        where: {
          id: originId,
          environment: {
            app: {
              deletedAt: null,
              workspaceId: workspace.id
            }
          }
        }
      });
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.EntityFieldId) {
      const matching = await this.prisma.entityField.count({
        where: {
          id: originId,
          entityVersion: {
            entity: {
              app: {
                deletedAt: null,
                workspaceId: workspace.id
              }
            }
          }
        }
      });
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.EntityPermissionFieldId) {
      const matching = await this.prisma.entityPermissionField.count({
        where: {
          id: originId,
          field: {
            entityVersion: {
              entity: {
                app: {
                  deletedAt: null,
                  workspaceId: workspace.id
                }
              }
            }
          }
        }
      });
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.EntityId) {
      const matching = await this.prisma.entity.count(checkByAppParameters);
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.BlockId) {
      const matching = await this.prisma.block.count(checkByAppParameters);
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.BuildId) {
      const matching = await this.prisma.build.count(checkByAppParameters);
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.AppRoleId) {
      const matching = await this.prisma.appRole.count(checkByAppParameters);
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.EnvironmentId) {
      const matching = await this.prisma.environment.count(
        checkByAppParameters
      );
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.CommitId) {
      const matching = await this.prisma.commit.count(checkByAppParameters);
      return matching === 1;
    }

    throw new Error(`Unexpected origin type ${originType}`);
  }
}
