import { EnumGitProvider } from "../../src/types";
import { GitServiceFactory } from "../../src/git/git-service-factory";
import { mock } from "jest-mock-extended";

import {
  GIT_HUB_FILE,
  INSTALLATION_URL,
  PR_HTML_URL,
  TEST_GIT_REMOTE_ORGANIZATION,
  TEST_GIT_REPO,
  TEST_GIT_REPOS,
} from "./git.constants";
import { GithubService } from "../../src/git/github.service";

export const MOCK_GIT_SERVICE_FACTORY = mock<GitServiceFactory>();

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

MOCK_GIT_SERVICE_FACTORY.getService
  .calledWith(EnumGitProvider.Github)
  .mockReturnValue(MOCK_GITHUB_SERVICE);
