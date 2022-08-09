import { GitOrganization, PrismaService } from '@amplication/prisma-db';
import { Injectable } from '@nestjs/common';
import { GitOrganizationInterface } from '../contracts/gitOrganization.interface';
import { EnumProvider } from '../entities/enums/provider';

@Injectable()
export class GitOrganizationRepository implements GitOrganizationInterface {
  constructor(private readonly prisma: PrismaService) {}

  async getOrganizationByInstallationId(
    installationId: string,
    provider: EnumProvider,
  ): Promise<GitOrganization> {
    return await this.prisma.gitOrganization.findUnique({
      where: {
        provider_installationId: {
          installationId,
          provider,
        },
      },
    });
  }
}
