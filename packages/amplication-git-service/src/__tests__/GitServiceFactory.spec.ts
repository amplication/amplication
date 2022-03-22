import { EnumGitProvider } from '../Dto/enums/EnumGitProvider';
import { GithubService } from '../providers/github.service';
import { GitServiceFactory } from '../utils/GitServiceFactory';
import { mock } from 'jest-mock-extended';

describe('GitServiceFactory', () => {
  const github = mock<GithubService>();
  const gitServiceFactory = new GitServiceFactory(github);
  describe('GitServiceFactory.getService()', () => {
    it('should return an github service', () => {
      expect(gitServiceFactory.getService(EnumGitProvider.Github)).toBe(github);
    });
    it('should throw error if source control dont exist', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(() => gitServiceFactory.getService('GitNone')).toThrow(Error);
    });
  });
});
