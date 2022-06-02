import { mock } from 'jest-mock-extended';
import { GitPullEventService } from '../../core/gitPullEvent/gitPullEvent.service';

export const GIT_PULL_EVENT_SERVICE_MOCK = mock<GitPullEventService>({});

GIT_PULL_EVENT_SERVICE_MOCK.handlePushEvent.mockReturnValue(Promise.resolve());
