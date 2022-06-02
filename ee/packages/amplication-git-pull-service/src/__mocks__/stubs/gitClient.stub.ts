import { GitProviderEnum } from '../../contracts/enums/gitProvider.enum';
import { EnumGitPullEventStatus } from '../../contracts/enums/gitPullEventStatus.enum';

export const MOCK_ACCESS_TOKEN = 'access_token123';

export const MOCK_EVENT_DATA = {
  id: BigInt(123),
  provider: GitProviderEnum.Github,
  repositoryOwner: 'amit-amp',
  repositoryName: 'test-repo',
  branch: 'main',
  commit: 'initial',
  status: EnumGitPullEventStatus.Created,
  pushedAt: new Date('2020-12-12'),
};

export const MOCK_UPDATED_EVENT_DATA = {
  ...MOCK_EVENT_DATA,
  status: EnumGitPullEventStatus.Ready,
};

export const PUSHED_EVENT_DATA = {
  ...MOCK_EVENT_DATA,
  installationId: '123456',
};

export const cloneStub = {
  pushEventMessage: PUSHED_EVENT_DATA,
  baseDir: '/git-remote-test/github/amit-org/sample-app/main/commit',
  installationId: '11552233',
  accessToken: '123456',
};

export const pullStub = {
  pushEventMessage: PUSHED_EVENT_DATA,
  baseDir: '/git-remote/github/amit-org/sample-app/main/commit',
  accessToken: '123456',
};
