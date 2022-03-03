import { Test, TestingModule } from '@nestjs/testing';
import { GitRepository } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { EnumGitProvider } from '../dto/enums/EnumGitProvider';
import { CreateGitRepositoryInput } from '../dto/inputs/CreateGitRepositoryInput';
import { RemoteGitRepositoriesWhereUniqueInput } from '../dto/inputs/RemoteGitRepositoriesWhereUniqueInput';
import { GitService } from '../git.service';
import { GitServiceFactory } from '../utils/GitServiceFactory/GitServiceFactory';
import { MOCK_GIT_SERVICE_FACTORY } from '../utils/GitServiceFactory/GitServiceFactory.mock';
import { TEST_GIT_REPOS } from '../__mocks__/GitRepos';

const EXAMPLE_GIT_REPOSITORY: GitRepository = {
  id: 'exampleGitRepositoryId',
  name: 'repositoryTest',
  appId: 'exampleAppId',
  gitOrganizationId: 'exampleGitOrganizationId',
  createdAt: new Date(),
  updatedAt: new Date()
};

const prismaGitRepositoryCreateMock = jest.fn((appName: string) => {
  if (appName === 'EXAMPLE_GIT_REPOSITORY') return null;
  return EXAMPLE_GIT_REPOSITORY;
});

describe('GitService', () => {
  let gitService: GitService;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GitService,
        {
          provide: PrismaService,
          useValue: {
            gitRepository: {
              create: prismaGitRepositoryCreateMock,
              findUnique: prismaGitRepositoryCreateMock
            },
            gitOrganization: {
              findUnique: prismaGitRepositoryCreateMock
            }
          }
        },
        {
          provide: GitServiceFactory,
          useValue: MOCK_GIT_SERVICE_FACTORY
        }
      ]
    }).compile();

    gitService = module.get<GitService>(GitService);
    //gitService = new GitService(MOCK_GIT_SERVICE_FACTORY, prismaService);
  });

  it('should be defined', () => {
    expect(gitService).toBeDefined();
  });
  //#region github
  {
    describe('GitService.getReposOfOrganization()', () => {
      it('should return RemoteGitRepositories[]', async () => {
        const remoteGitRepositoriesWhereUniqueInput: RemoteGitRepositoriesWhereUniqueInput = {
          gitOrganizationId: 'exampleGitOrganizationId',
          gitProvider: EnumGitProvider.Github
        };
        const remoteGitRepositories = await gitService.getReposOfOrganization(
          remoteGitRepositoriesWhereUniqueInput
        );
        expect(remoteGitRepositories).toEqual(TEST_GIT_REPOS);
        expect(prismaGitRepositoryCreateMock).toBeCalledTimes(1);
      });
    });
    describe('GitService.createRepo()', () => {
      it('should return GitRepo', async () => {
        const createGitRepositoryInput: CreateGitRepositoryInput = {
          name: 'EXAMPLE_APP_NAME',
          appId: 'EXAMPLE_APP_DESCRIPTION',
          gitOrganizationId: 'DEFAULT_APP_COLOR',
          gitProvider: EnumGitProvider.Github,
          public: true
        };
        expect(
          await gitService.createGitRepository(createGitRepositoryInput)
        ).toEqual(EXAMPLE_GIT_REPOSITORY);
        expect(prismaGitRepositoryCreateMock).toBeCalledTimes(1);
        expect(prismaGitRepositoryCreateMock).toBeCalledWith(
          createGitRepositoryInput
        );
      });
    });
  }
  //#endregion
});
