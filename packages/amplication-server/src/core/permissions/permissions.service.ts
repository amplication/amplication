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

    const checkByResourceParameters = {
      where: {
        id: originId,
        resource: {
          deletedAt: null,
          project: {
            workspace: {
              id: workspace.id
            }
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

    if (originType === AuthorizableOriginParameter.ProjectId) {
      const matching = await this.prisma.project.count({
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

    if (originType === AuthorizableOriginParameter.ResourceId) {
      const matching = await this.prisma.resource.count({
        where: {
          deletedAt: null,
          id: originId,
          project: {
            workspace: {
              id: workspace.id
            }
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
                    resource: {
                      deletedAt: null,
                      project: {
                        workspaceId: workspace.id
                      }
                    }
                  }
                }
              }
            },
            {
              id: originId,
              builds: {
                some: {
                  resource: {
                    deletedAt: null,
                    project: {
                      workspaceId: workspace.id
                    }
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
            resource: {
              deletedAt: null,
              project: {
                workspaceId: workspace.id
              }
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
              resource: {
                deletedAt: null,
                project: {
                  workspaceId: workspace.id
                }
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
                resource: {
                  deletedAt: null,
                  project: {
                    workspaceId: workspace.id
                  }
                }
              }
            }
          }
        }
      });
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.EntityId) {
      const matching = await this.prisma.entity.count(
        checkByResourceParameters
      );
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.BlockId) {
      const matching = await this.prisma.block.count(checkByResourceParameters);
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.BuildId) {
      const matching = await this.prisma.build.count(checkByResourceParameters);
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.ResourceRoleId) {
      const matching = await this.prisma.resourceRole.count(
        checkByResourceParameters
      );
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.EnvironmentId) {
      const matching = await this.prisma.environment.count(
        checkByResourceParameters
      );
      return matching === 1;
    }
    if (originType === AuthorizableOriginParameter.CommitId) {
      const matching = await this.prisma.commit.count({
        where: {
          id: originId,
          project: {
            deletedAt: null,
            workspaceId: workspace.id
          }
        }
      });
      return matching === 1;
    }

    throw new Error(`Unexpected origin type ${originType}`);
  }
}
