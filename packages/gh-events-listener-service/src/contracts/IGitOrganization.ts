export interface IGitOrganization {
  getOrganizationByInstallationId(installationId: string): Promise<string>;
}
