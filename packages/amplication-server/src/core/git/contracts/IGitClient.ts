import { GitOrganization } from 'src/models/GitOrganization';
import { CreateGitOrganizationArgs } from '../dto/args/CreateGitOrganizationArgs';
import { CreateGitRepositoryInput } from '../dto/inputs/CreateGitRepositoryInput';
import { GitRepo } from '../dto/objects/GitRepo';

export interface IGitClient {
  createRepo(args: CreateGitRepositoryInput): Promise<GitRepo>;
  getOrganizationRepos(gitOrganizationId: string): Promise<GitRepo[]>;
  isRepoExist(token: string, name: string): Promise<boolean>;
  createGitOrganization(
    args: CreateGitOrganizationArgs
  ): Promise<GitOrganization>;
  getGitInstallationUrl(workspaceId: string): Promise<string>;
  deleteGitOrganization(workspaceId: string): Promise<boolean>;
}
