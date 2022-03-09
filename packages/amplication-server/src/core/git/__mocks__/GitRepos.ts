import { RemoteGitRepository } from '../dto/objects/RemoteGitRepository';
import { TEST_GIT_REPO } from './GitRepo';

export const TEST_GIT_REPOS: RemoteGitRepository[] = [
  TEST_GIT_REPO,
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
