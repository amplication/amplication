import { CreateGitRemoteRepoInput } from '../dto/inputs/CreateGitRemoteRepoInput';
import { GitRepo } from '../dto/objects/GitRepo';

export interface IGitClient {
  createRepo(data: CreateGitRemoteRepoInput): Promise<GitRepo>;
  getOrganizationRepos(installationId: number): Promise<GitRepo[]>;
  isRepoExist(installationId: number, name: string): Promise<boolean>;
  getGitInstallationUrl(workspaceId: string): Promise<string>;
  deleteGitOrganization(installationId: number): Promise<boolean>;
  getGitOrganizationName(installationId: string): Promise<string>;
}
