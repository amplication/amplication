import { GitServiceFactory } from '@amplication/git-service/src/utils/GitServiceFactory';
import { mock } from 'jest-mock-extended';
import { EnumGitProvider } from '../../dto/enums/EnumGitProvider';
import { MOCK_GITHUB_SERVICE } from '../../__mocks__/Github';

export const MOCK_GIT_SERVICE_FACTORY = mock<GitServiceFactory>();

MOCK_GIT_SERVICE_FACTORY.getService
  .calledWith(EnumGitProvider.Github)
  .mockReturnValue(MOCK_GITHUB_SERVICE);
