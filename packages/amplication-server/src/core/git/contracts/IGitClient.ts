import { CreateGitRemoteRepoInput } from '../dto/inputs/CreateGitRemoteRepoInput';
import { RemoteGitOrganization } from '../dto/objects/RemoteGitOrganization';
import { RemoteGitRepository } from '../dto/objects/RemoteGitRepository';
export interface IGitClient {
  createRepo(data: CreateGitRemoteRepoInput): Promise<RemoteGitRepository>;
  getOrganizationRepos(installationId: number): Promise<RemoteGitRepository[]>;
  isRepoExist(installationId: number, name: string): Promise<boolean>;
  getGitInstallationUrl(workspaceId: string): Promise<string>;
  deleteGitOrganization(installationId: number): Promise<boolean>;
  getGitRemoteOrganization(
    installationId: string
  ): Promise<RemoteGitOrganization>;
}
