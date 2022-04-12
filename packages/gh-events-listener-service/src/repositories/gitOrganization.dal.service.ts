import { PrismaService } from '@amplication/prisma-db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GitOrganizationDal {
  constructor(private readonly prisma: PrismaService) {}

  async getOrganizationByInstallationId(
    installationId: string,
  ): Promise<string> {
    return (
      await this.prisma.gitOrganization.findFirst({
        where: {
          installationId: installationId,
        },
      })
    ).installationId;
  }
}
