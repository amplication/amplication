export interface IGitProvider {
  createInstallationAccessToken: (installationId: string) => Promise<string>;
}
