/* eslint-disable @typescript-eslint/ban-ts-comment */
import { mock } from 'jest-mock-extended';
import { AppService } from '../../app/app.service';
import { TEST_APP_ID, TEST_APP_MOCK } from '../../app/__mocks__/App.mock';
import { EnumSourceControlService } from '../dto/enums/EnumSourceControlService';
import { GitService } from '../git.service';
import { TEST_GIT_REPO } from '../__mocks__/GitRepo';
import { TEST_GIT_REPOS } from '../__mocks__/GitRepos';
import { githubService } from '../__mocks__/GitService.mock';

describe('GitService', () => {
  let gitService: GitService;
  beforeEach(() => {
    const appService = mock<AppService>();
    appService.app.mockReturnValue(Promise.resolve(TEST_APP_MOCK));
    gitService = new GitService(githubService, appService);
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
          appId: TEST_APP_ID,
          sourceControlService
        });
        expect(repos).toBe(TEST_GIT_REPOS);
      });
    });
    describe('GitService.createRepo()', () => {
      it('should return GitRepo', async () => {
        const repo = await gitService.createRepo({
          appId: TEST_APP_ID,
          sourceControlService,
          input: { name: 'repo', public: true }
        });
        expect(repo).toBe(TEST_GIT_REPO);
      });
    });
  }
  //#endregion
});
