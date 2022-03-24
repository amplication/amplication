import { GithubService } from '../providers/github.service';
import { mock } from 'jest-mock-extended';
import { TEST_GIT_REPOS } from './RemoteGitRepositories';
import { TEST_GIT_REPO } from './RemoteGitRepository';
import { TEST_GIT_REMOTE_ORGANIZATION } from './RemoteGitOrganization';
import { INSTALLATION_URL, PR_HTML_URL } from './Constants';
import { GIT_HUB_FILE } from './GithubFile';

export const MOCK_GITHUB_SERVICE = mock<GithubService>({});
MOCK_GITHUB_SERVICE.getOrganizationRepos.mockReturnValue(
  Promise.resolve(TEST_GIT_REPOS)
);

MOCK_GITHUB_SERVICE.createOrganizationRepository.mockReturnValue(
  Promise.resolve(TEST_GIT_REPO)
);

MOCK_GITHUB_SERVICE.getGitRemoteOrganization.mockReturnValue(
  Promise.resolve(TEST_GIT_REMOTE_ORGANIZATION)
);

MOCK_GITHUB_SERVICE.deleteGitOrganization.mockReturnValue(
  Promise.resolve(true)
);

MOCK_GITHUB_SERVICE.getGitInstallationUrl.mockReturnValue(
  Promise.resolve(INSTALLATION_URL)
);

MOCK_GITHUB_SERVICE.getFile.mockReturnValue(Promise.resolve(GIT_HUB_FILE));

MOCK_GITHUB_SERVICE.createPullRequest.mockReturnValue(
  Promise.resolve(PR_HTML_URL)
);
