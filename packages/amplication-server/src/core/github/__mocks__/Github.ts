import { Matcher, mock } from 'jest-mock-extended';
import { TEST_APP_MOCK } from 'src/core/app/__mocks__/App.mock';
import { CreateRepoArgsType } from 'src/core/git/contracts/types/CreateRepoArgsType';
import { TEST_GIT_REPO } from 'src/core/git/__mocks__/GitRepo';
import { TEST_GIT_REPOS } from 'src/core/git/__mocks__/GitRepos';
import { GithubService } from '../github.service';
import { GithubTokenExtractor } from '../utils/tokenExtractor/githubTokenExtractor';

const mockGithubTokenExtractor = mock<GithubTokenExtractor>();
mockGithubTokenExtractor.getTokenFromDb
  .calledWith(TEST_APP_MOCK.id)
  .mockReturnValue(Promise.resolve(TEST_APP_MOCK.githubToken));

export const MOCK_GITHUB_SERVICE = mock<GithubService>({
  tokenExtractor: mockGithubTokenExtractor
});
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
