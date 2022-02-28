import { PrismaService } from 'nestjs-prisma';
import { TEST_APP_MOCK } from 'src/core/app/__mocks__/App.mock';
import { EnumGitProvider } from '../dto/enums/EnumGitProvider';
import { GitService } from '../git.service';
import { MOCK_GIT_SERVICE_FACTORY } from '../utils/GitServiceFactory/GitServiceFactory.mock';
import { TEST_GIT_REPO } from '../__mocks__/GitRepo';
import { TEST_GIT_REPOS } from '../__mocks__/GitRepos';

describe('GitService', () => {
  let gitService: GitService;
  let prismaService: PrismaService;
  beforeEach(() => {
    gitService = new GitService(MOCK_GIT_SERVICE_FACTORY, prismaService);
  });
  it('should be defined', () => {
    expect(gitService).toBeDefined();
  });
  //#region github
  {
    const gitProvider = EnumGitProvider.Github;
    const gitOrganizationId = 'dfggfgg47448';
    describe('GitService.getReposOfOrganization()', () => {
      it('should return GitRepo[]', async () => {
        const repos = await gitService.getReposOfOrganization({
          gitOrganizationId,
          gitProvider
        });
        expect(repos).toBe(TEST_GIT_REPOS);
      });
    });
    describe('GitService.createRepo()', () => {
      it('should return GitRepo', async () => {
        const repo = await gitService.createGitRepository({
          name: 'repo',
          appId: TEST_APP_MOCK.id,
          gitOrganizationId: gitOrganizationId,
          public: true,
          gitProvider: gitProvider
        });
        expect(repo).toBe(TEST_GIT_REPO);
      });
    });
  }
  //#endregion
});
