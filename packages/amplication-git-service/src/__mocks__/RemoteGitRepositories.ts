import { RemoteGitRepository } from '../Dto/entities/RemoteGitRepository';

export const TEST_GIT_REPOS: RemoteGitRepository[] = [
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
];
