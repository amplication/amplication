import { mock } from "jest-mock-extended";
import { GitProviderService } from "../../../providers/gitProvider/gitProvider.service";
import { MOCK_ACCESS_TOKEN } from "../../mockData";

export const MOCK_GIT_PROVIDER_SERVICE = mock<GitProviderService>({});

MOCK_GIT_PROVIDER_SERVICE.createInstallationAccessToken.mockReturnValue(
  Promise.resolve(MOCK_ACCESS_TOKEN)
);
