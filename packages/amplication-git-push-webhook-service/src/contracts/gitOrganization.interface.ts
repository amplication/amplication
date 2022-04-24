import { GitOrganization } from '@amplication/prisma-db';
import { EnumProvider } from '../entities/enums/provider';

export interface GitOrganizationInterface {
  getOrganizationByInstallationId(
    installationId: string,
    provider: EnumProvider,
  ): Promise<GitOrganization>;
}
