import * as os from "os";
import { EnumGitPullEventStatus } from "../contracts/enums/gitPullEventStatus";
import { IGitPullEvent } from "../contracts/interfaces/gitPullEvent.interface";
import { IPullParams } from "../contracts/interfaces/clonePullParams.interface";

export const MOCK_ACCESS_TOKEN = "accesstoken123";

export const PULL_EVENT_MOCK: IGitPullEvent = {
  id: BigInt(123),
  branch: "main",
  commit: "initial",
  provider: "GitHub",
  repositoryName: "test-repo",
  repositoryOwner: "amit-amp",
  status: EnumGitPullEventStatus.Created,
  pushedAt: new Date("2020-12-12"),
};

export const CREATE_PULL_EVENT_MOCK = {
  data: { ...PULL_EVENT_MOCK },
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

export const PULL_DATA_MOCK: IPullParams = {
  remote: "origin",
  branch: "main",
  baseDir: os.homedir() + "/Dev/gitPullTest/test-1",
  commit: "as122df",
};
