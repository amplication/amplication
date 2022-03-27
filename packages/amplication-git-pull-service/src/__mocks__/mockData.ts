import {
  EnumGitPullEventStatus,
  IGitPullEvent,
} from "../contracts/databaseOperations.interface";
import { IPullParams } from "../contracts/gitClient.interface";
import os from "os";

export const pullEventMock: IGitPullEvent = {
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

export const pullDataMock: IPullParams = {
  remote: "origin",
  branch: "main",
  baseDir: os.homedir() + "/Dev/gitPullTest/test-1",
  commit: "as122df",
};
