import { TEST_APP_MOCK } from 'src/core/app/__mocks__/App.mock';
import { EnumSourceControlService } from '../dto/enums/EnumSourceControlService';
import { GitService } from '../git.service';
import { MOCK_GIT_SERVICE_FACTORY } from '../utils/GitServiceFactory/GitServiceFactory.mock';
import { TEST_GIT_REPO } from '../__mocks__/GitRepo';
import { TEST_GIT_REPOS } from '../__mocks__/GitRepos';

describe('GitService', () => {
  let gitService: GitService;
  beforeEach(() => {
    gitService = new GitService(MOCK_GIT_SERVICE_FACTORY);
  });
  it('should be defined', () => {
    expect(gitService).toBeDefined();
  });
  //#region github
  {
    const sourceControlService = EnumSourceControlService.Github;
    describe('GitService.getReposOfUser()', () => {
      it('should return GitRepo[]', async () => {
        const repos = await gitService.getReposOfUser({
          appId: TEST_APP_MOCK.id,
          sourceControlService
        });
        expect(repos).toBe(TEST_GIT_REPOS);
      });
    });
    describe('GitService.createRepo()', () => {
      it('should return GitRepo', async () => {
        const repo = await gitService.createRepo({
          appId: TEST_APP_MOCK.id,
          sourceControlService,
          input: { name: 'repo', public: true }
        });
        expect(repo).toBe(TEST_GIT_REPO);
      });
    });
  }
  //#endregion
});
