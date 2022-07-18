import { PrismaService } from 'nestjs-prisma';
import { GitPullEventRepository } from '../../repositories/gitPullEvent.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  MOCK_EVENT_DATA,
  MOCK_UPDATED_EVENT_DATA,
} from '../../__mocks__/stubs/gitClient.stub';
import { eventRepositoryStub } from '../../__mocks__/stubs/eventRepository.stub';
import { EnumGitPullEventStatus } from '../../contracts/enums/gitPullEventStatus.enum';

const prismaGitPullEventCreateMock = jest.fn(() =>
  Promise.resolve({ id: BigInt(123) })
);
const prismaGitPullEventUpdateMock = jest.fn(() =>
  Promise.resolve(MOCK_UPDATED_EVENT_DATA)
);
const prismaGitPullEventManyMock = jest.fn(async () =>
  Promise.resolve([MOCK_EVENT_DATA])
);

describe('Testing GitPullEventRepository', () => {
  let gitPullEventRepository: GitPullEventRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GitPullEventRepository,
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            gitPullEvent: {
              create: prismaGitPullEventCreateMock,
              update: prismaGitPullEventUpdateMock,
              findMany: prismaGitPullEventManyMock,
            },
          })),
        },
      ],
    }).compile();

    gitPullEventRepository = module.get<GitPullEventRepository>(
      GitPullEventRepository
    );
  });

  it('should be defined', () => {
    expect(gitPullEventRepository).toBeDefined();
  });

  it('should create a new record on database', async () => {
    const newRecord = await gitPullEventRepository.create(
      eventRepositoryStub.create
    );
    expect(newRecord).toEqual({ id: BigInt(123) });
    expect(prismaGitPullEventCreateMock).toBeCalledTimes(1);
    expect(prismaGitPullEventCreateMock).toBeCalledWith(
      eventRepositoryStub.argsStub.create
    );
  });

  it("should update a record's status on database", async () => {
    const newRecord = await gitPullEventRepository.update(
      BigInt(123),
      EnumGitPullEventStatus.Ready
    );
    expect(newRecord).toEqual(true);
    expect(prismaGitPullEventUpdateMock).toBeCalledTimes(1);
    expect(prismaGitPullEventUpdateMock).toBeCalledWith(
      eventRepositoryStub.argsStub.update
    );
  });

  it('should return a single gitPullEvent record with status ready', async () => {
    const { eventData, skip } = eventRepositoryStub.findByPreviousReadyCommit;
    expect(
      await gitPullEventRepository.findByPreviousReadyCommit(
        eventData.provider,
        eventData.repositoryOwner,
        eventData.repositoryName,
        eventData.branch,
        eventData.pushedAt,
        skip
      )
    ).toEqual(MOCK_EVENT_DATA);
    expect(prismaGitPullEventManyMock).toBeCalledTimes(1);
    expect(prismaGitPullEventManyMock).toBeCalledWith(
      eventRepositoryStub.argsStub.findByPreviousCommit
    );
  });
});
