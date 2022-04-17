import { PrismaService } from '@amplication/prisma-db';
import { Injectable } from '@nestjs/common';
import { IGitOrganization } from 'src/contracts/IGitOrganization';

@Injectable()
export class GitOrganizationRepository implements IGitOrganization {
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
