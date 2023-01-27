import { GitFactory } from "@amplication/git-utils";
import { mock } from "jest-mock-extended";
import { EnumGitProvider } from "../../dto/enums/EnumGitProvider";
import { MOCK_GITHUB_SERVICE } from "../../__mocks__/Github";

export const MOCK_GIT_SERVICE_FACTORY = mock<GitFactory>();

MOCK_GIT_SERVICE_FACTORY.getProvider
  .calledWith({ provider: EnumGitProvider.Github })
  .mockReturnValue(MOCK_GITHUB_SERVICE);
