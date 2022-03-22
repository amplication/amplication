import { GithubService } from '../providers/github.service';
import { mock } from 'jest-mock-extended';
import { RemoteGitRepository } from '../Dto/entities/RemoteGitRepository';

const TEST_GIT_REPOS: RemoteGitRepository[] = [
  {
    admin: true,
    fullName: 'tupe12334/ofek',
    name: 'ofek',
    private: true,
    url: 'http://localhost/ofek',
  },
  {
    admin: false,
    fullName: 'tupe12334/test',
    name: 'test',
    private: true,
    url: 'http://localhost/test',
  },
];

const TEST_GIT_REPO: RemoteGitRepository = {
  admin: true,
  fullName: 'tupe12334/repo',
  name: 'repo',
  private: false,
  url: 'localhost/repo',
};

export const MOCK_GITHUB_SERVICE = mock<GithubService>({});
MOCK_GITHUB_SERVICE.getOrganizationRepos.mockReturnValue(
  Promise.resolve(TEST_GIT_REPOS),
);

MOCK_GITHUB_SERVICE.createOrganizationRepository.mockReturnValue(
  Promise.resolve(TEST_GIT_REPO),
);
