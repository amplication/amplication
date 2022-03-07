import { CreateGitRemoteRepoInput } from '../dto/inputs/CreateGitRemoteRepoInput';
import { RemoteGitRepository } from '../dto/objects/RemoteGitRepository';
export interface IGitClient {
  createRepo(data: CreateGitRemoteRepoInput): Promise<RemoteGitRepository>;
  getOrganizationRepos(installationId: number): Promise<RemoteGitRepository[]>;
  isRepoExist(installationId: number, name: string): Promise<boolean>;
  getGitInstallationUrl(workspaceId: string): Promise<string>;
  deleteGitOrganization(installationId: number): Promise<boolean>;
  getGitOrganizationName(installationId: string): Promise<string>;
  getGitInstallationOrganizationType(installationId: string): Promise<string>;
}
