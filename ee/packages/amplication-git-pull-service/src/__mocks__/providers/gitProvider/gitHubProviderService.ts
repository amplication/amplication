import { MOCK_ACCESS_TOKEN } from '../../stubs/gitClient.stub';
import { mock } from 'jest-mock-extended';
import { GitHostProviderService } from '../../../providers/gitProvider/gitHostProvider.service';

export const MOCK_GITHUB_PROVIDER_SERVICE = mock<GitHostProviderService>({
  createInstallationAccessToken: jest.fn().mockImplementation(
    () =>
      ({
        data: {
          accessToken: MOCK_ACCESS_TOKEN,
        },
      }.data.accessToken)
  ),
});
