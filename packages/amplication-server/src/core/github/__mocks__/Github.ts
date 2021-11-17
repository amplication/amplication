import { Matcher, mock } from 'jest-mock-extended';
import { CreateRepoArgsType } from 'src/core/git/contracts/types/CreateRepoArgsType';
import { TEST_GIT_REPO } from 'src/core/git/__mocks__/GitRepo';
import { TEST_GIT_REPOS } from 'src/core/git/__mocks__/GitRepos';
import { GithubService } from '../github.service';

export const TEST_GITHUB_TOKEN = 'GITHUB_TOKEN';
export const MOCK_GITHUB_SERVICE = mock<GithubService>();
MOCK_GITHUB_SERVICE.getUserRepos.mockReturnValue(
  Promise.resolve(TEST_GIT_REPOS)
);
MOCK_GITHUB_SERVICE.createRepo
  .calledWith(
    new Matcher<CreateRepoArgsType>(actualValue => {
      return actualValue.input.name === 'repo';
    }, `Make sure that the name of the repo is "repo"`)
  )
  .mockReturnValue(Promise.resolve(TEST_GIT_REPO));
