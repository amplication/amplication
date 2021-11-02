import { Matcher, mock } from 'jest-mock-extended';
import { GithubService } from '../../github/github.service';
import { CreateRepoArgsType } from '../contracts/types/CreateRepoArgsType';
import { TEST_GIT_REPO } from './GitRepo';
import { TEST_GIT_REPOS } from './GitRepos';

export const githubService = mock<GithubService>();
githubService.getUserRepos.mockReturnValue(Promise.resolve(TEST_GIT_REPOS));
githubService.createRepo
  .calledWith(
    new Matcher<CreateRepoArgsType>(actualValue => {
      return actualValue.input.name === 'repo';
    }, `Make sure that the name of the repo is "repo"`)
  )
  .mockReturnValue(Promise.resolve(TEST_GIT_REPO));
