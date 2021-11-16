import {
  MOCK_INVALID_APP_ID,
  TEST_APP_ID,
  TEST_APP_MOCK
} from 'src/core/app/__mocks__/App.mock';
import { mockAppService } from 'src/core/app/__mocks__/AppService.mock';
import { TokenFactory } from './TokenFactory';

describe('TokenFactory', () => {
  const tokenFactory = new TokenFactory(mockAppService);
  describe('TokenFactory.getToken()', () => {
    it('should return a string token', async () => {
      expect(await tokenFactory.getToken(TEST_APP_ID)).toBe(
        TEST_APP_MOCK.githubToken
      );
    });
    it('should throw error if prisma dont find any app with app id', () => {
      return expect(
        tokenFactory.getToken(MOCK_INVALID_APP_ID)
      ).rejects.toThrow();
    });
  });
});
