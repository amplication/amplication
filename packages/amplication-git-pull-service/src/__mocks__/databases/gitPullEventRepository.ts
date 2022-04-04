import { mock } from "jest-mock-extended";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import { LAST_READY_COMMIT_MOCK } from "../mockData";

export const GIT_PULL_EVENT_REPOSITORY_MOCK = mock<GitPullEventRepository>({});

GIT_PULL_EVENT_REPOSITORY_MOCK.create.mockReturnValue(
  Promise.resolve(LAST_READY_COMMIT_MOCK)
);
GIT_PULL_EVENT_REPOSITORY_MOCK.update.mockReturnValue(
  Promise.resolve(LAST_READY_COMMIT_MOCK)
);
GIT_PULL_EVENT_REPOSITORY_MOCK.getPreviousReadyCommit.mockReturnValue(
  Promise.resolve(LAST_READY_COMMIT_MOCK)
);
