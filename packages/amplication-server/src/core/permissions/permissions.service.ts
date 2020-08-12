import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
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
    switch (resourceType) {
      case AuthorizableResourceParameter.OrganizationId:
      case AuthorizableResourceParameter.EntityId:
      case AuthorizableResourceParameter.EntityFieldId: {
        return true;
      }
      case AuthorizableResourceParameter.AppId: {
        const matchingApps = await this.prisma.app.findMany({
          where: {
            id: resourceId,
            organization: {
              id: user.organization.id
            }
          }
        });
        return matchingApps.length === 1;
      }
      case AuthorizableResourceParameter.BlockId: {
        const matchingApps = await this.prisma.block.findMany({
          where: {
            id: resourceId,
            app: {
              organization: {
                id: user.organization.id
              }
            }
          }
        });
        return matchingApps.length === 1;
      }
      case AuthorizableResourceParameter.AppRoleId: {
        const matchingApps = await this.prisma.appRole.findMany({
          where: {
            id: resourceId,
            app: {
              organization: {
                id: user.organization.id
              }
            }
          }
        });
        return matchingApps.length === 1;
      }
    }
    throw new Error(`Unexpected resource type ${resourceType}`);
  }
}
