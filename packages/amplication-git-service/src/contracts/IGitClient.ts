import { GithubFile } from '../Dto/entities/GithubFile';
import { RemoteGitOrganization } from '../Dto/entities/RemoteGitOrganization';
import { RemoteGitRepository } from '../Dto/entities/RemoteGitRepository';

export interface IGitClient {
  createUserRepository(
    installationId: string,
    owner: string,
    name: string
  ): Promise<RemoteGitRepository>;

  createOrganizationRepository(
    installationId: string,
    owner: string,
    name: string
  ): Promise<RemoteGitRepository>;

  getOrganizationRepos(installationId: string): Promise<RemoteGitRepository[]>;

  isRepoExist(installationId: string, name: string): Promise<boolean>;

  getGitInstallationUrl(workspaceId: string): Promise<string>;

  deleteGitOrganization(installationId: string): Promise<boolean>;

  getGitRemoteOrganization(
    installationId: string
  ): Promise<RemoteGitOrganization>;

  getFile(
    userName: string,
    repoName: string,
    path: string,
    baseBranchName: string,
    installationId: string
  ): Promise<GithubFile>;

  createPullRequest(
    userName: string,
    repoName: string,
    modules: { path: string; code: string }[],
    commitName: string,
    commitMessage: string,
    commitDescription: string,
    baseBranchName: string,
    installationId: string,
    amplicationBuildId: string
  ): Promise<string>;
}
