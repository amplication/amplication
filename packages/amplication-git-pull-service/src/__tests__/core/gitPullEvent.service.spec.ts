import { GitPullEventService } from "../../core/gitPullEvent/gitPullEvent.service";
import { Test, TestingModule } from "@nestjs/testing";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { MOCK_GIT_PROVIDER_FACTORY } from "../../__mocks__/providers/gitProvider/gitProviderFactory";
import { MOCK_GIT_CLIENT_SERVICE } from "../../__mocks__/providers/gitClient/gitClientService";
import { StorageService } from "../../providers/storage/storage.service";
import { GIT_PULL_EVENT_REPOSITORY_MOCK } from "../../__mocks__/databases/gitPullEventRepository";
import { GitHostProviderFactory } from "../../utils/gitHostProviderFactory/gitHostProviderFactory";
import { MOCK_STORAGE_SERVICE } from "../../__mocks__/providers/storage/storageService";
import { WinstonModule } from "nest-winston";
import { PrismaModule } from "nestjs-prisma";

describe("Testing GitPullEventService", () => {
  let gitPullEventService: GitPullEventService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [WinstonModule.forRoot({}), PrismaModule],
      providers: [
        GitPullEventService,
        { provide: StorageService, useValue: MOCK_STORAGE_SERVICE },
        {
          provide: GitHostProviderFactory,
          useValue: MOCK_GIT_PROVIDER_FACTORY,
        },
        { provide: GitClientService, useValue: MOCK_GIT_CLIENT_SERVICE },
        {
          provide: GitPullEventRepository,
          useValue: GIT_PULL_EVENT_REPOSITORY_MOCK,
        },
      ],
    }).compile();

    gitPullEventService = module.get<GitPullEventService>(GitPullEventService);
  });

  it("should be defined", () => {
    expect(gitPullEventService).toBeDefined();
  });
});
