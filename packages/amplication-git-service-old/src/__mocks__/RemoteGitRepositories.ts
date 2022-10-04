import { RemoteGitRepos } from '../Dto/entities/RemoteGitRepository';

export const TEST_GIT_REPOS: RemoteGitRepos = {
  repos: [
    {
      admin: true,
      fullName: 'tupe12334/ofek',
      name: 'ofek',
      private: true,
      url: 'http://localhost/ofek'
    },
    {
      admin: false,
      fullName: 'tupe12334/test',
      name: 'test',
      private: true,
      url: 'http://localhost/test'
    }
  ],
  totalRepos: 2,
  pageSize: 2,
  currentPage: 1
};
