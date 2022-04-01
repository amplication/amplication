import { mock } from "jest-mock-extended";
import { GitClientService } from "../../../providers/gitClient/gitClient.service";

export const MOCK_GIT_CLIENT_SERVICE = mock<GitClientService>({});

MOCK_GIT_CLIENT_SERVICE.clone.mockReturnValue(Promise.resolve());

MOCK_GIT_CLIENT_SERVICE.pull.mockReturnValue(Promise.resolve());
