import { GitOrganization } from 'src/models/GitOrganization';
import { CreateGitOrganizationArgs } from '../dto/args/CreateGitOrganizationArgs';
import { CreateGitRepositoryInput } from '../dto/inputs/CreateGitRepositoryInput';
import { RemoteGitRepository } from '../dto/objects/RemoteGitRepository';

export interface IGitClient {
  createRepo(args: CreateGitRepositoryInput): Promise<RemoteGitRepository>;
  getOrganizationRepos(
    gitOrganizationId: string
  ): Promise<RemoteGitRepository[]>;
  isRepoExist(token: string, name: string): Promise<boolean>;
  createGitOrganization(
    args: CreateGitOrganizationArgs
  ): Promise<GitOrganization>;
  getGitInstallationUrl(workspaceId: string): Promise<string>;
  deleteGitOrganization(workspaceId: string): Promise<boolean>;
}
