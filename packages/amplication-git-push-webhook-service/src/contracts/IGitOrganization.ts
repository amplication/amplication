import { EnumProvider } from '../entities/enums/provider';

export interface IGitOrganization {
  getOrganizationByInstallationId(
    installationId: string,
    provider: EnumProvider,
  ): Promise<string>;
}
