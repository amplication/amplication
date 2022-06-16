import { EnumGitPullEventStatus } from '../../contracts/enums/gitPullEventStatus.enum';
import { MOCK_EVENT_DATA } from './gitClient.stub';
import { GitProviderEnum } from '../../contracts/enums/gitProvider.enum';

const CREATE_ARGS = {
  data: MOCK_EVENT_DATA,
  select: {
    id: true,
  },
};

const UPDATE_ARGS = {
  where: { id: BigInt(123) },
  data: { status: EnumGitPullEventStatus.Ready },
};

const FIND_BY_ARGS = {
  where: {
    provider: GitProviderEnum.Github,
    repositoryOwner: 'amit-amp',
    repositoryName: 'test-repo',
    branch: 'main',
    status: EnumGitPullEventStatus.Ready,
    pushedAt: {
      lt: new Date('2020-12-12'),
    },
  },
  orderBy: {
    pushedAt: 'desc',
  },
  skip: 0,
  take: 1,
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

export const eventRepositoryStub = {
  create: {
    id: BigInt(123),
    provider: GitProviderEnum.Github,
    repositoryOwner: 'amit-amp',
    repositoryName: 'test-repo',
    branch: 'main',
    commit: 'initial',
    status: EnumGitPullEventStatus.Created,
    pushedAt: new Date('2020-12-12'),
  },
  update: {
    id: BigInt(123),
    status: EnumGitPullEventStatus.Ready,
  },
  findByPreviousReadyCommit: {
    eventData: MOCK_EVENT_DATA,
    skip: 0,
  },
  argsStub: {
    create: CREATE_ARGS,
    update: UPDATE_ARGS,
    findByPreviousCommit: FIND_BY_ARGS,
  },
};
