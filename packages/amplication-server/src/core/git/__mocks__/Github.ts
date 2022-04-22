import { GithubService } from '@amplication/git-service';
import { mock } from 'jest-mock-extended';
import { TEST_GIT_REPO } from 'src/core/git/__mocks__/GitRepo';
import { TEST_GIT_REPOS } from 'src/core/git/__mocks__/GitRepos';

export const MOCK_GITHUB_SERVICE = mock<GithubService>({});
MOCK_GITHUB_SERVICE.getOrganizationRepos.mockReturnValue(
  Promise.resolve(TEST_GIT_REPOS)
);
MOCK_GITHUB_SERVICE.createOrganizationRepository.mockReturnValue(
  Promise.resolve(TEST_GIT_REPO)
);
