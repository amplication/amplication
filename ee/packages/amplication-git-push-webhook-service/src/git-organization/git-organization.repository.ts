import { GitOrganization, PrismaService } from '../prisma';
import { Injectable } from '@nestjs/common';
import { EnumProvider } from './git-organization.types';

@Injectable()
export class GitOrganizationRepository {
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
