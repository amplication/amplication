import { GitRepo } from '../dto/objects/GitRepo';
import { GitUser } from '../dto/objects/GitUser';
import { ITokenExtractor } from './ITokenExtractor';
import { CreateRepoArgsType } from './types/CreateRepoArgsType';

export interface IGitClient {
  createRepo(args: CreateRepoArgsType): Promise<GitRepo>;
  getUserRepos(token: string): Promise<GitRepo[]>;
  isRepoExist(token: string, name: string): Promise<boolean>;
  getUser(token: string): Promise<GitUser>;
  tokenExtractor: ITokenExtractor;
}
