import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { User } from 'src/models';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  checkByAppParameters = {
    [AuthorizableResourceParameter.EntityId]: this.prisma.entity,
    [AuthorizableResourceParameter.EntityFieldId]: this.prisma.entityField,
    [AuthorizableResourceParameter.AppId]: this.prisma.app,
    [AuthorizableResourceParameter.BlockId]: this.prisma.block,
    [AuthorizableResourceParameter.BuildId]: this.prisma.build,
    [AuthorizableResourceParameter.AppRoleId]: this.prisma.appRole,
    [AuthorizableResourceParameter.EnvironmentId]: this.prisma.environment
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
    if (resourceType === AuthorizableResourceParameter.ActionId) {
      const matching = await this.prisma.action.count({
        where: {
          id: resourceId,
          builds: {
            some: {
              app: {
                organizationId: organization.id
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
