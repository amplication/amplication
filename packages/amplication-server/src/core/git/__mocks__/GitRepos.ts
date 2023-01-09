import { RemoteGitRepos } from "../dto/objects/RemoteGitRepository";

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
  totalRepos: 2,
  pageSize: 2,
  currentPage: 1,
};
