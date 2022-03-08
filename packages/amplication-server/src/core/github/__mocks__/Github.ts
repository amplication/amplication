import { mock } from 'jest-mock-extended';
import { TEST_GIT_REPOS } from 'src/core/git/__mocks__/GitRepos';
import { GithubService } from '../github.service';

export const MOCK_GITHUB_SERVICE = mock<GithubService>({});
MOCK_GITHUB_SERVICE.getOrganizationRepos.mockReturnValue(
  Promise.resolve(TEST_GIT_REPOS)
);
// MOCK_GITHUB_SERVICE.createRepo
//   .calledWith(
//     new Matcher<CreateGitRemoteRepoInput>(actualValue => {
//       return actualValue.name === 'repo';
//     }, `Make sure that the name of the repo is "repo"`)
//   )
//   .mockReturnValue(Promise.resolve(TEST_GIT_REPO));
