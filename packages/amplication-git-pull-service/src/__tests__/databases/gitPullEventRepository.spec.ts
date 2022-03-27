import { PrismaModule } from "nestjs-prisma";
import { Test, TestingModule } from "@nestjs/testing";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import { MOCK_GIT_PULL_EVENT_REPOSITORY } from "../../__mocks__/databases/gitPullEventRepository";
import { pullEventMock } from "../../__mocks__/mockData";
import { EnumGitPullEventStatus } from "../../contracts/databaseOperations.interface";

describe("Testing GitPullEventRepository", () => {
  let gitPullEventRepository: GitPullEventRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        {
          provide: GitPullEventRepository,
          useValue: MOCK_GIT_PULL_EVENT_REPOSITORY,
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
    const newRecord = await gitPullEventRepository.create(pullEventMock);
    expect(newRecord).toEqual(pullEventMock);
  });

  it("should create a update a record's status on database", async () => {
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
