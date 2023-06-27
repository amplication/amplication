import { EnumGitProvider } from "../../src/types";
import { GitFactory } from "../../src/git-factory";
import { mock } from "jest-mock-extended";

import {
  GIT_HUB_FILE,
  INSTALLATION_URL,
  PR_HTML_URL,
  TEST_GIT_REMOTE_ORGANIZATION,
  TEST_GIT_REPO,
  TEST_GIT_REPOS,
} from "./git.constants";
import { GithubService } from "../../src/providers/github/github.service";

export const MOCK_GIT_SERVICE_FACTORY = mock<GitFactory>();

export const MOCK_GITHUB_SERVICE = mock<GithubService>({});
MOCK_GITHUB_SERVICE.getRepositories.mockReturnValue(
  Promise.resolve(TEST_GIT_REPOS)
);

MOCK_GITHUB_SERVICE.createRepository.mockReturnValue(
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

MOCK_GIT_SERVICE_FACTORY.getProvider
  .calledWith({ provider: EnumGitProvider.Github, installationId: "123456" })
  .mockReturnValue(MOCK_GITHUB_SERVICE);
