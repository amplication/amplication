import { GitOrganization } from 'src/models/GitOrganization';
import { CreateGitOrganizationArgs } from '../dto/args/CreateGitOrganizationArgs';
import { GitRepo } from '../dto/objects/GitRepo';
import { ITokenExtractor } from './ITokenExtractor';
import { CreateRepoArgsType } from './types/CreateRepoArgsType';

export interface IGitClient {
  createRepo(args: CreateRepoArgsType): Promise<GitRepo>;
  getOrganizationRepos(token: string): Promise<GitRepo[]>;
  isRepoExist(token: string, name: string): Promise<boolean>;
  getGitOrganization(gitOrganizationId:string):Promise<GitOrganization>;
  createGitOrganization(args:CreateGitOrganizationArgs):Promise<GitOrganization>;
  getGitInstallationUrl(workspaceId: string):Promise<string>; 
  deleteGitOrganization(workspaceId: string):Promise<boolean>; 

  tokenExtractor: ITokenExtractor;
}
