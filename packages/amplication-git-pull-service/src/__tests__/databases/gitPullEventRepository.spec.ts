import { PrismaService } from "nestjs-prisma";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import {
  CREATE_PULL_EVENT_MOCK, LAST_READY_COMMIT_MOCK,
  PULL_EVENT_MOCK,
  UPDATE_PULL_EVENT_MOCK
} from "../../__mocks__/mockData";
import { EnumGitPullEventStatus } from "../../contracts/enums/gitPullEventStatus";
import { Test, TestingModule } from "@nestjs/testing";

const prismaGitPUllEventCreateMock = jest.fn(() => PULL_EVENT_MOCK);
const prismaGitPUllEventUpdateMock = jest.fn(() => ({
  ...PULL_EVENT_MOCK,
  status: EnumGitPullEventStatus.Ready,
}));
const prismaGitPUllEventManyMock = jest.fn( () => {
  return [LAST_READY_COMMIT_MOCK].shift();
});

describe("Testing GitPullEventRepository", () => {
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
              create: prismaGitPUllEventCreateMock,
              update: prismaGitPUllEventUpdateMock,
              findMany: prismaGitPUllEventManyMock,
            },
          })),
        },
      ],
    }).compile();

    gitPullEventRepository = module.get<GitPullEventRepository>(
      GitPullEventRepository
    );
  });

  it("should be defined", () => {
    expect(gitPullEventRepository).toBeDefined();
  });

  it("should create a new record on database", async () => {
    const newRecord = await gitPullEventRepository.create(PULL_EVENT_MOCK);
    expect(newRecord).toEqual(PULL_EVENT_MOCK);
    expect(prismaGitPUllEventCreateMock).toBeCalledTimes(1);
    expect(prismaGitPUllEventCreateMock).toBeCalledWith({
      ...CREATE_PULL_EVENT_MOCK,
    });
  });

  it("should create a update a record's status on database", async () => {
    const newRecord = await gitPullEventRepository.update(
      BigInt(123),
      EnumGitPullEventStatus.Ready
    );
    expect(newRecord).toEqual({
      ...PULL_EVENT_MOCK,
      status: EnumGitPullEventStatus.Ready,
    });
    expect(prismaGitPUllEventUpdateMock).toBeCalledTimes(1);
    expect(prismaGitPUllEventUpdateMock).toBeCalledWith({
      ...UPDATE_PULL_EVENT_MOCK,
    });
  });

  it.skip("should return a single gitPullEvent record with status ready", async () => {
    const args = {
      where: {
        provider: "GitHub",
        repositoryOwner: "amit-amp",
        repositoryName: "test-repo",
        branch: "main",
        status: EnumGitPullEventStatus.Ready,
        pushedAt: {
          lt: new Date("2020-12-12")
        }
      },
      orderBy: {
        pushedAt: 'desc'
      },
      skip: 1,
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
      }}
    expect(await gitPullEventRepository.getPreviousReadyCommit(
      { ...PULL_EVENT_MOCK, status: EnumGitPullEventStatus.Ready },
      1,
    )).toEqual([LAST_READY_COMMIT_MOCK].shift());
    expect(prismaGitPUllEventManyMock).toBeCalledTimes(1);
    expect(prismaGitPUllEventManyMock).toBeCalledWith(args);
  });
});
