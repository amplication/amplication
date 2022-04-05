import { GitProviderEnum } from "../../contracts/enums/gitProvider.enum";
import { EnumGitPullEventStatus } from "../../contracts/enums/gitPullEventStatus.enum";

export const MOCK_ACCESS_TOKEN = "accesstoken123";

export const MOCK_EVENT_DATA = {
  id: BigInt(123),
  provider: GitProviderEnum.Github,
  repositoryOwner: "amit-amp",
  repositoryName: "test-repo",
  branch: "main",
  commit: "initial",
  status: EnumGitPullEventStatus.Created,
  pushedAt: new Date("2020-12-12"),
};

export const cloneStub = {
  eventData: MOCK_EVENT_DATA,
  baseDir: "/git-remote/github/amit-org/sample-app/main/commit",
  installationId: "11552233",
  accessToken: "123456",
};

export const pullStub = {
  branch: "main",
  commit: "7eac38d",
  baseDir: "/git-remote/github/amit-org/sample-app/main/commit",
};
