import {
  MOCK_APP_WITHOUT_GITHUB_TOKEN,
  MOCK_INVALID_APP_ID,
  TEST_APP_ID,
  TEST_APP_MOCK
} from 'src/core/app/__mocks__/App.mock';
import { mockAppService } from 'src/core/app/__mocks__/AppService.mock';
import { AmplicationError } from 'src/errors/AmplicationError';
import { MISSING_TOKEN_ERROR, TokenFactory } from './TokenFactory';

describe('TokenFactory', () => {
  const tokenFactory = new TokenFactory(mockAppService);
  describe('TokenFactory.getToken()', () => {
    it('should return a string token', async () => {
      expect(await tokenFactory.getTokenFromApp(TEST_APP_ID)).toBe(
        TEST_APP_MOCK.githubToken
      );
    });
    it('should throw error if prisma dont find any app with app id', () => {
      return expect(
        tokenFactory.getTokenFromApp(MOCK_INVALID_APP_ID)
      ).rejects.toThrow();
    });
    it('should throw error if app db object missing token', () => {
      return expect(
        tokenFactory.getTokenFromApp(MOCK_APP_WITHOUT_GITHUB_TOKEN.id)
      ).rejects.toThrow(new AmplicationError(MISSING_TOKEN_ERROR));
    });
  });
});
