import { Test, TestingModule } from '@nestjs/testing';
import { EnumGitProvider } from '../../Dto/enums/EnumGitProvider';
import { RemoteGitRepository } from '../..//Dto/entities/RemoteGitRepository';
import { GitModule } from '../../git.module';
import { GithubService } from '../..//providers/github.service';
import { GitService } from '../../services/git.service';
import { GitServiceFactory } from '../../utils/GitServiceFactory';

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

describe('GitService', () => {
  let gitService: GitService;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [GitService, GithubService, GitServiceFactory],
      imports: [GitModule],
    }).compile();

    gitService = module.get<GitService>(GitService);
  });

  it('should be defined', () => {
    expect(gitService).toBeDefined();
  });
  {
    describe('GitService.getReposOfOrganization()', () => {
      it('should return RemoteGitRepositories[]', async () => {
        const installationId = '24297005';
        const gitProvider = EnumGitProvider.Github;
        const remoteGitRepositories = await gitService.getReposOfOrganization(
          gitProvider,
          installationId,
        );
        expect(remoteGitRepositories).toEqual(TEST_GIT_REPOS);
      });
    });
  }
});
