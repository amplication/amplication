import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { User } from '../../models';
import { WhereParentIdInput } from 'src/dto/inputs';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async UserCanAccessOrganization(user: User, organizationId: string) {
    return true;
  }

  async UserCanAccessApp(user: User, appId: string): Promise<boolean> {
    return (
      (
        await this.prisma.app.findMany({
          where: {
            id: appId,
            organization: {
              id: user.organization.id
            }
          }
        })
      ).length === 1
    );
  }

  async UserCanAccessEntity(user: User, entityId: string) {
    return true;
  }

  async UserCanAccessEntityField(user: User, entityFieldId: string) {
    return true;
  }
}
