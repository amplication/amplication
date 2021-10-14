import { GitRepo } from '../dto/objects/GitRepo';
import { CreateRepoArgsType } from './types/CreateRepoArgsType';
import { GetUserReposArgsType } from './types/GetUserReposArgsType';

export interface IGitClient {
  createRepo(args: CreateRepoArgsType): Promise<GitRepo>;
  getUserRepos(args: GetUserReposArgsType): Promise<GitRepo[]>;
}
