import { PrismaModule, PrismaService } from "nestjs-prisma";
import { Test, TestingModule } from "@nestjs/testing";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import { MOCK_GIT_PULL_EVENT_REPOSITORY } from "../../__mocks__/databases/gitPullEventRepository";
import { pullEventMock } from "../../__mocks__/mockData";
import { EnumGitPullEventStatus } from "../../contracts/databaseOperations.interface";

describe("Testing GitPullEventRepository", () => {
  let gitPullEventRepository: GitPullEventRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        PrismaService,
        {
          provide: GitPullEventRepository,
          useValue: MOCK_GIT_PULL_EVENT_REPOSITORY,
        },
      ],
    }).compile();

    gitPullEventRepository = module.get<GitPullEventRepository>(
      GitPullEventRepository
    );

    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(gitPullEventRepository).toBeDefined();
  });

  it("should create a new record on database", async () => {
    prisma.gitPullEvent.create = jest.fn().mockReturnValueOnce(pullEventMock);
    const newRecord = await gitPullEventRepository.create(pullEventMock);
    expect(newRecord).toEqual(pullEventMock);
  });

  it("should create a update a record's status on database", async () => {
    prisma.gitPullEvent.update = jest.fn().mockReturnValueOnce({
      ...pullEventMock,
      status: EnumGitPullEventStatus.Ready,
    });
    const newRecord = await gitPullEventRepository.update(
      123,
      EnumGitPullEventStatus.Ready
    );
    expect(newRecord).toEqual({
      ...pullEventMock,
      status: EnumGitPullEventStatus.Ready,
    });
  });
});
