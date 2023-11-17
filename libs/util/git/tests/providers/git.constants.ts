import {
  EnumGitOrganizationType,
  GitFile,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
} from "../../src/types";

export const INSTALLATION_URL = "ExampleInstallationUrl";

export const PR_HTML_URL = "ExamplePrHtmlUrl";

export const GIT_HUB_FILE: GitFile = {
  name: "exampleGithubFileName",
  path: "examplePath",
  content: "exampleContent",
};

export const TEST_GIT_REMOTE_ORGANIZATION: RemoteGitOrganization = {
  name: "testGitRemoteOrganization",
  type: EnumGitOrganizationType.Organization,
  useGroupingForRepositories: false,
};

export const TEST_GIT_REPOS: RemoteGitRepos = {
  repos: [
    {
      admin: true,
      fullName: "tupe12334/ofek",
      name: "ofek",
      private: true,
      url: "http://localhost/ofek",
      defaultBranch: "main",
    },
    {
      admin: false,
      fullName: "tupe12334/test",
      name: "test",
      private: true,
      url: "http://localhost/test",
      defaultBranch: "main",
    },
  ],
  total: 2,
  pagination: {
    perPage: 2,
    page: 1,
  },
};

export const TEST_GIT_REPO: RemoteGitRepository = {
  admin: true,
  fullName: "tupe12334/repo",
  name: "repo",
  private: false,
  url: "localhost/repo",
  defaultBranch: "main",
};
