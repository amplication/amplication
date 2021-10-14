import { GitRepo } from '../dto/objects/GitRepo';
import { CreateRepoArgsType } from './types/CreateRepoArgsType';

export interface IGitClient {
  createRepo(args: CreateRepoArgsType): Promise<GitRepo>;
  getUserRepos(token: string): Promise<GitRepo[]>;
}
