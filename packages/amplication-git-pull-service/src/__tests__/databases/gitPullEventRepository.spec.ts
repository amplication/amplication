import { PrismaService } from "nestjs-prisma";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import {
  CREATE_PULL_EVENT_MOCK,
  LAST_READY_COMMIT_MOCK,
  PULL_EVENT_MOCK,
  UPDATE_PULL_EVENT_MOCK,
} from "../../__mocks__/mockData";
import { EnumGitPullEventStatus } from "../../contracts/enums/gitPullEventStatus.enum";
import { Test, TestingModule } from "@nestjs/testing";
import { GitProviderEnum } from "../../contracts/enums/gitProvider.enum";

const prismaGitPullEventCreateMock = jest.fn(() => PULL_EVENT_MOCK);
const prismaGitPullEventUpdateMock = jest.fn(() => ({
  ...PULL_EVENT_MOCK,
  status: EnumGitPullEventStatus.Ready,
}));
const prismaGitPullEventManyMock = jest.fn(async () => {
  return [LAST_READY_COMMIT_MOCK];
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

  it("should be defined", () => {
    expect(gitPullEventRepository).toBeDefined();
  });

  it("should create a new record on database", async () => {
    const newRecord = await gitPullEventRepository.create(
      GitProviderEnum.Github,
      "amit-amp",
      "test-repo",
      "main",
      "initial",
      EnumGitPullEventStatus.Created,
      new Date("2020-12-12")
    );
    expect(newRecord).toEqual(PULL_EVENT_MOCK);
    expect(prismaGitPullEventCreateMock).toBeCalledTimes(1);
    expect(prismaGitPullEventCreateMock).toBeCalledWith({
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
    expect(prismaGitPullEventUpdateMock).toBeCalledTimes(1);
    expect(prismaGitPullEventUpdateMock).toBeCalledWith({
      ...UPDATE_PULL_EVENT_MOCK,
    });
  });

  it("should return a single gitPullEvent record with status ready", async () => {
    const args = {
      where: {
        provider: GitProviderEnum.Github,
        repositoryOwner: "amit-amp",
        repositoryName: "test-repo",
        branch: "main",
        status: EnumGitPullEventStatus.Ready,
        pushedAt: {
          lt: new Date("2020-12-12"),
        },
      },
      orderBy: {
        pushedAt: "desc",
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
      },
    };
    expect(
      await gitPullEventRepository.getPreviousReadyCommit(
        { ...PULL_EVENT_MOCK, status: EnumGitPullEventStatus.Ready },
        1
      )
    ).toEqual([LAST_READY_COMMIT_MOCK][0]);
    expect(prismaGitPullEventManyMock).toBeCalledTimes(1);
    expect(prismaGitPullEventManyMock).toBeCalledWith(args);
  });
});
