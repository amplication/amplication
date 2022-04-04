import { GitPullEventService } from "../../core/gitPullEvent/gitPullEvent.service";
import { Test, TestingModule } from "@nestjs/testing";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import { GitHostProviderService } from "../../providers/gitProvider/gitHostProvider.service";
import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { MOCK_GIT_PROVIDER_SERVICE } from "../../__mocks__/providers/gitProvider/gitProviderService";
import { MOCK_GIT_CLIENT_SERVICE } from "../../__mocks__/providers/gitClient/gitClientService";
import { StorageService } from "../../providers/storage/storage.service";
import { GIT_PULL_EVENT_REPOSITORY_MOCK } from "../../__mocks__/databases/gitPullEventRepository";
import { EnumGitPullEventStatus } from "../../contracts/enums/gitPullEventStatus.enum";
import os from "os";
import { GIT_PULL_EVENT_SERVICE_MOCK } from "../../__mocks__/core/gitPullEventService";
import { GitProviderEnum } from "../../contracts/enums/gitProvider.enum";
import { CREATE_GIT_PULL_EVENT_RECORD_0N_DB } from "../../__mocks__/mockData";

describe("Testing GitPullEventService", () => {
  let gitPullEventService: GitPullEventService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        { provide: GitPullEventService, useValue: GIT_PULL_EVENT_SERVICE_MOCK },
        {
          provide: GitHostProviderService,
          useValue: MOCK_GIT_PROVIDER_SERVICE,
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
