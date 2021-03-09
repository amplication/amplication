import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { User } from 'src/models';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resource parameters that are directly related to app and can be validated
   * by access of user to app.
   */
  checkByAppParameters = {
    [AuthorizableResourceParameter.EntityId]: this.prisma.entity,
    [AuthorizableResourceParameter.BlockId]: this.prisma.block,
    [AuthorizableResourceParameter.BuildId]: this.prisma.build,
    [AuthorizableResourceParameter.AppRoleId]: this.prisma.appRole,
    [AuthorizableResourceParameter.EnvironmentId]: this.prisma.environment,
    [AuthorizableResourceParameter.CommitId]: this.prisma.commit
  };

  async validateAccess(
    user: User,
    resourceType: AuthorizableResourceParameter,
    resourceId: string
  ): Promise<boolean> {
    const { organization } = user;
    if (resourceType === AuthorizableResourceParameter.OrganizationId) {
      return resourceId === organization.id;
    }
    if (resourceType === AuthorizableResourceParameter.AppId) {
      const matching = await this.prisma.app.count({
        where: {
          id: resourceId,
          organization: {
            id: organization.id
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
                      organizationId: organization.id
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
                    organizationId: organization.id
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
              organizationId: organization.id
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
                organizationId: organization.id
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
                  organizationId: organization.id
                }
              }
            }
          }
        }
      });
      return matching === 1;
    }
    if (resourceType in this.checkByAppParameters) {
      const delegate = this.checkByAppParameters[resourceType];
      const matching = await delegate.count({
        where: {
          id: resourceId,
          app: {
            organization: {
              id: organization.id
            }
          }
        }
      });
      return matching === 1;
    }
    throw new Error(`Unexpected resource type ${resourceType}`);
  }
}
