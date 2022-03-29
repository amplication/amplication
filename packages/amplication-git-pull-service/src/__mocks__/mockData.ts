import os from "os";
import { EnumGitPullEventStatus } from "../contracts/enums/gitPullEventStatus";
import { IGitPullEvent } from "../contracts/interfaces/gitPullEvent.interface";
import { IPullParams } from "../contracts/interfaces/clonePullParams.interface";

export const MOCK_ACCESS_TOKEN = "accesstoken123";

export const PULL_EVENT_MOCK: IGitPullEvent = {
  id: 123,
  branch: "main",
  commit: "initial",
  provider: "GitHub",
  repositoryName: "test-repo",
  repositoryOwner: "amit-amp",
  status: EnumGitPullEventStatus.Created,
  pushedAt: "2022-10-20",
  createdAt: "2020-12-12",
  updatedAt: "2022-10-20",
};

export const PULL_DATA_MOCK: IPullParams = {
  remote: "origin",
  branch: "main",
  baseDir: os.homedir() + "/Dev/gitPullTest/test-1",
  commit: "as122df",
};
