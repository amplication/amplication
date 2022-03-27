import { mock } from "jest-mock-extended";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import { pullEventMock } from "../mockData";
import { EnumGitPullEventStatus } from "../../contracts/databaseOperations.interface";

export const MOCK_GIT_PULL_EVENT_REPOSITORY = mock<GitPullEventRepository>({});

MOCK_GIT_PULL_EVENT_REPOSITORY.create.mockReturnValue(
  Promise.resolve(pullEventMock)
);
MOCK_GIT_PULL_EVENT_REPOSITORY.update.mockReturnValue(
  Promise.resolve({ ...pullEventMock, status: EnumGitPullEventStatus.Ready })
);
