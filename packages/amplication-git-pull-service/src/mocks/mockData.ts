import {
  EnumGitPullEventStatus,
  IGitPullEvent,
} from "../contracts/databaseOperations.interface";

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
