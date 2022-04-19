import { PrismaService } from '@amplication/prisma-db';
import { Injectable } from '@nestjs/common';
import { IGitOrganization } from 'src/contracts/IGitOrganization';
import { EnumProvider } from '../entities/enums/provider';

@Injectable()
export class GitOrganizationRepository implements IGitOrganization {
  constructor(private readonly prisma: PrismaService) {}

  async getOrganizationByInstallationId(
    installationId: string,
    provider: EnumProvider,
  ): Promise<string> {
    return (
      await this.prisma.gitOrganization.findUnique({
        where: {
          provider_installationId: {
            installationId,
            provider,
          },
        },
      })
    ).installationId;
  }
}
