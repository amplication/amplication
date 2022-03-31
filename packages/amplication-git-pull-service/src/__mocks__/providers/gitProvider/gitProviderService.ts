import { mock } from "jest-mock-extended";
import { GitHostProviderService } from "../../../providers/gitProvider/gitHostProvider.service";
import { MOCK_ACCESS_TOKEN } from "../../mockData";

export const MOCK_GIT_PROVIDER_SERVICE = mock<GitHostProviderService>({});

MOCK_GIT_PROVIDER_SERVICE.createInstallationAccessToken.mockReturnValue(
  Promise.resolve(MOCK_ACCESS_TOKEN)
);
