import { Matcher, mock } from 'jest-mock-extended';
import { TEST_APP_MOCK } from 'src/core/app/__mocks__/App.mock';
import { AmplicationError } from 'src/errors/AmplicationError';
import { AppService } from '../../../';
import { FindOneArgs } from '../../../../dto';
import { GithubTokenExtractor } from './githubTokenExtractor';

describe('GithubTokenExtractor', () => {
  describe('GithubTokenExtractor.getTokenFromDb()', () => {
    const mockAppService = mock<AppService>();

    const githubTokenExtractor = new GithubTokenExtractor(mockAppService);

    it('should return the github token form the app service', async () => {
      mockAppService.app
        .calledWith(
          new Matcher<FindOneArgs>(actualValue => {
            return actualValue.where.id === TEST_APP_MOCK.id;
          }, `Make sure the the app function get the wanted id`)
        )
        .mockReturnValue(Promise.resolve(TEST_APP_MOCK));
      const result = await githubTokenExtractor.getTokenFromDb(
        TEST_APP_MOCK.id
      );
      expect(result).toBe(TEST_APP_MOCK.githubToken);
    });
    it('should throw an amplication error if got an empty app', () => {
      mockAppService.app.mockResolvedValue(null);
      return expect(
        githubTokenExtractor.getTokenFromDb('not existing app id')
      ).rejects.toThrow(AmplicationError);
    });
  });
});
