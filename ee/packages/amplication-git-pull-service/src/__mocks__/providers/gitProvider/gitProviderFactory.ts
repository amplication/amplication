import { mock } from 'jest-mock-extended';
import { GitHostProviderFactory } from '../../../utils/gitHostProviderFactory/gitHostProviderFactory';
import { GitProviderEnum } from '../../../contracts/enums/gitProvider.enum';
import { MOCK_GITHUB_PROVIDER_SERVICE } from './gitHubProviderService';

export const MOCK_GIT_PROVIDER_FACTORY = mock<GitHostProviderFactory>({});

MOCK_GIT_PROVIDER_FACTORY.getHostProvider
  .calledWith(GitProviderEnum.Github)
  .mockReturnValue(MOCK_GITHUB_PROVIDER_SERVICE);
