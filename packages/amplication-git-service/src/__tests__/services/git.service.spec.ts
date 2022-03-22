import { Test, TestingModule } from '@nestjs/testing';
import { EnumGitProvider } from '../../Dto/enums/EnumGitProvider';
import { RemoteGitRepository } from '../..//Dto/entities/RemoteGitRepository';
import { GitService } from '../../services/git.service';
import { GitServiceFactory } from '../../utils/GitServiceFactory';
import { MOCK_GIT_SERVICE_FACTORY } from '../../__mocks__/GitServiceFactory.mock';
import { EnumGitOrganizationType } from '../../Dto/enums/EnumGitOrganizationType';

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
      providers: [
        GitService,
        {
          provide: GitServiceFactory,
          useValue: MOCK_GIT_SERVICE_FACTORY,
        },
      ],
    }).compile();

    gitService = module.get<GitService>(GitService);
  });

  it('should be defined', () => {
    expect(gitService).toBeDefined();
  });
  {
    describe('GitService.createRepo()', () => {
      it('should return App', async () => {
        expect(
          await gitService.createGitRepository(
            'repoName',
            EnumGitProvider.Github,
            EnumGitOrganizationType.Organization,
            'gitOrganizationName',
            '123456',
          ),
        ).toEqual(RemoteGitRepository);
      });
    });

    describe('GitService.getReposOfOrganization()', () => {
      it('should return RemoteGitRepositories[]', async () => {
        const installationId = '123456';
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
