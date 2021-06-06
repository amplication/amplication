import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { User } from 'src/models';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async validateAccess(
    user: User,
    resourceType: AuthorizableResourceParameter,
    resourceId: string
  ): Promise<boolean> {
    const { workspace } = user;

    const checkByAppParameters = {
      where: {
        id: resourceId,
        app: {
          workspace: {
            id: workspace.id
          }
        }
      }
    };

    if (resourceType === AuthorizableResourceParameter.WorkspaceId) {
      return resourceId === workspace.id;
    }
    if (resourceType === AuthorizableResourceParameter.AppId) {
      const matching = await this.prisma.app.count({
        where: {
          id: resourceId,
          workspace: {
            id: workspace.id
          }
        }
      });
      return matching === 1;
    }
    if (resourceType === AuthorizableResourceParameter.ApiTokenId) {
      const matching = await this.prisma.apiToken.count({
        where: {
          id: resourceId,
          userId: user.id
        }
      });
      return matching === 1;
    }
    if (resourceType === AuthorizableResourceParameter.ActionId) {
      const matching = await this.prisma.action.count({
        where: {
          // eslint-disable-next-line  @typescript-eslint/naming-convention
          OR: [
            {
              id: resourceId,
              deployments: {
                some: {
                  build: {
                    app: {
                      workspaceId: workspace.id
                    }
                  }
                }
              }
            },
            {
              id: resourceId,
              builds: {
                some: {
                  app: {
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
    if (resourceType === AuthorizableResourceParameter.DeploymentId) {
      const matching = await this.prisma.deployment.count({
        where: {
          id: resourceId,
          environment: {
            app: {
              workspaceId: workspace.id
            }
          }
        }
      });
      return matching === 1;
    }
    if (resourceType === AuthorizableResourceParameter.EntityFieldId) {
      const matching = await this.prisma.entityField.count({
        where: {
          id: resourceId,
          entityVersion: {
            entity: {
              app: {
                workspaceId: workspace.id
              }
            }
          }
        }
      });
      return matching === 1;
    }
    if (
      resourceType === AuthorizableResourceParameter.EntityPermissionFieldId
    ) {
      const matching = await this.prisma.entityPermissionField.count({
        where: {
          id: resourceId,
          field: {
            entityVersion: {
              entity: {
                app: {
                  workspaceId: workspace.id
                }
              }
            }
          }
        }
      });
      return matching === 1;
    }
    if (resourceType === AuthorizableResourceParameter.EntityId) {
      const matching = await this.prisma.entity.count(checkByAppParameters);
      return matching === 1;
    }
    if (resourceType === AuthorizableResourceParameter.BlockId) {
      const matching = await this.prisma.block.count(checkByAppParameters);
      return matching === 1;
    }
    if (resourceType === AuthorizableResourceParameter.BuildId) {
      const matching = await this.prisma.build.count(checkByAppParameters);
      return matching === 1;
    }
    if (resourceType === AuthorizableResourceParameter.AppRoleId) {
      const matching = await this.prisma.appRole.count(checkByAppParameters);
      return matching === 1;
    }
    if (resourceType === AuthorizableResourceParameter.EnvironmentId) {
      const matching = await this.prisma.environment.count(
        checkByAppParameters
      );
      return matching === 1;
    }
    if (resourceType === AuthorizableResourceParameter.CommitId) {
      const matching = await this.prisma.commit.count(checkByAppParameters);
      return matching === 1;
    }

    throw new Error(`Unexpected resource type ${resourceType}`);
  }
}
