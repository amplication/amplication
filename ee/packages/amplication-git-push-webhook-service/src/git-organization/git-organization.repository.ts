import { GitOrganization, PrismaService } from '@amplication/prisma-clients/amplication-prisma-db';
import { Injectable } from '@nestjs/common';
import { EnumProvider, GitOrganizationInterface } from './git-organization.types';


@Injectable()
export class GitOrganizationRepository implements GitOrganizationInterface {
  constructor(private readonly prisma: PrismaService) {}

  async getOrganizationByInstallationId(
    installationId: string,
    provider: EnumProvider,
  ): Promise<GitOrganization> {
    return await this.prisma.gitOrganization.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        provider_installationId: {
          installationId,
          provider,
        },
      },
    });
  }
}
