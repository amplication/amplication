import { GitServiceFactory } from '@amplication/git-service/src/utils/GitServiceFactory';
import { mock } from 'jest-mock-extended';
import { MOCK_GITHUB_SERVICE } from 'src/core/github/__mocks__/Github';
import { EnumGitProvider } from '../../dto/enums/EnumGitProvider';

export const MOCK_GIT_SERVICE_FACTORY = mock<GitServiceFactory>();

MOCK_GIT_SERVICE_FACTORY.getService
  .calledWith(EnumGitProvider.Github)
  .mockReturnValue(MOCK_GITHUB_SERVICE);
