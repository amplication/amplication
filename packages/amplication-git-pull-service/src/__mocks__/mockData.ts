import * as os from "os";
import { EnumGitPullEventStatus } from "../contracts/enums/gitPullEventStatus.enum";
import { EventData } from "../contracts/interfaces/eventData";
import { GitProviderEnum } from "../contracts/enums/gitProvider.enum";

export const MOCK_ACCESS_TOKEN = "accesstoken123";

export const CLONE_EVENT_MOCK = {
  provider: GitProviderEnum.Github,
  repositoryOwner: "amit-amp",
  repositoryName: "test-repo",
  branch: "main",
  commit: "initial",
  pushedAt: new Date(),
  baseDir: os.homedir() + "/Dev/gitPullTest/test-1",
  installationId: "123456",
  accessToken: "112233445566",
};

export const PULL_EVENT_MOCK: EventData = {
  id: BigInt(123),
  provider: GitProviderEnum.Github,
  repositoryOwner: "amit-amp",
  repositoryName: "test-repo",
  branch: "main",
  commit: "initial",
  status: EnumGitPullEventStatus.Created,
  pushedAt: new Date("2020-12-12"),
};

export const CREATE_GIT_PULL_EVENT_RECORD_0N_DB = {
  provider: GitProviderEnum.Github,
  repositoryOwner: "amit-amp",
  repositoryName: "test-repo",
  branch: "main",
  commit: "initial",
  status: EnumGitPullEventStatus.Created,
  pushedAt: new Date("2020-12-12"),
};

export const LAST_READY_COMMIT_MOCK: EventData = {
  id: BigInt(123),
  provider: GitProviderEnum.Github,
  repositoryOwner: "amit-amp",
  repositoryName: "test-repo",
  branch: "main",
  commit: "initial",
  status: EnumGitPullEventStatus.Ready,
  pushedAt: new Date("2020-12-12"),
};

export const CREATE_PULL_EVENT_MOCK = {
  data: { ...CREATE_GIT_PULL_EVENT_RECORD_0N_DB },
  select: {
    id: true,
    provider: true,
    repositoryOwner: true,
    repositoryName: true,
    branch: true,
    commit: true,
    status: true,
    pushedAt: true,
  },
};

export const UPDATE_PULL_EVENT_MOCK = {
  where: { id: BigInt(123) },
  data: { status: EnumGitPullEventStatus.Ready },
  select: {
    id: true,
    provider: true,
    repositoryOwner: true,
    repositoryName: true,
    branch: true,
    commit: true,
    status: true,
    pushedAt: true,
  },
};

export const PUSH_EVENT_HANDLER_MOCK_PARAMS = {
  provider: GitProviderEnum.Github,
  repositoryOwner: "amit-amp-org",
  repositoryName: "sample-test",
  branch: "main",
  commit: "66a4b76",
  status: EnumGitPullEventStatus.Created,
  pushedAt: new Date(),
  baseDir: `${os.homedir()}/git-remote/amit-amp-org/sample-test/main/66a4b76`,
  remote: "origin",
  installationId: "123456",
  skip: 0,
};

export const NEW_RECORD = {
  id: BigInt(112233),
  provider: GitProviderEnum.Github,
  repositoryOwner: "amit-amp-org",
  repositoryName: "sample-test",
  branch: "main",
  commit: "11erf44",
  status: EnumGitPullEventStatus.Created,
  pushedAt: new Date(),
};
