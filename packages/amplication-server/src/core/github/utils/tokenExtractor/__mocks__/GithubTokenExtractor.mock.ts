import { mock } from 'jest-mock-extended';
import { TEST_APP_ID } from 'src/core/app/__mocks__/appId.mock';
import { TEST_GITHUB_TOKEN } from 'src/core/github/__mocks__/token.mock';
import { GithubTokenExtractor } from '../githubTokenExtractor';

export const mockGithubTokenExtractor = mock<GithubTokenExtractor>();
mockGithubTokenExtractor.getTokenFromDb
  .calledWith(TEST_APP_ID)
  .mockReturnValue(Promise.resolve(TEST_GITHUB_TOKEN));
