export interface IGitProvider {
  createInstallationAccessToken: (installationId: string) => IOctokitInstallationAccessTokenResponse;
  gitOrganizationRepositories: () => IAccessedRepositories[];
}

interface IOctokitInstallationAccessTokenResponse {
  status: number;
  headers: object;
  data: {
    token: string;
    expires_at: string;
    permissions: object;
    repository_selection: string;
    repositories: [];
  }
}

interface IAccessedRepositories {
  id: number;
  name: string;
  private: boolean;
  owner: string;
  pushed_at: string; // date string
}
