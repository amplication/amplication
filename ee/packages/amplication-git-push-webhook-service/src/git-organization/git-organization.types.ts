import { GitOrganization } from '@amplication/prisma-clients/amplication-prisma-db';

export enum EnumProvider {
  Github = 'Github',
}

export interface GitOrganizationInterface {
  getOrganizationByInstallationId(
    installationId: string,
    provider: EnumProvider,
  ): Promise<GitOrganization>;
}