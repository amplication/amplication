export interface GitProvider {
  createInstallationAccessToken: (installationId: string) => Promise<string>;
}
