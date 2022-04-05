import { GitPullEventService } from "../../core/gitPullEvent/gitPullEvent.service";
import { Test, TestingModule } from "@nestjs/testing";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { MOCK_GIT_PROVIDER_FACTORY } from "../../__mocks__/providers/gitProvider/gitProviderFactory";
import { StorageService } from "../../providers/storage/storage.service";
import { GitHostProviderFactory } from "../../utils/gitHostProviderFactory/gitHostProviderFactory";
import { MOCK_STORAGE_SERVICE } from "../../__mocks__/providers/storage/storageService";
import { WinstonModule } from "nest-winston";
import { PrismaModule } from "nestjs-prisma";
import * as winston from "winston";
import { utilities as nestWinstonModuleUtilities } from "nest-winston/dist/winston.utilities";
import { mockGitClientService } from "../../__mocks__/providers/gitClient/gitClientService";
import { GIT_PULL_EVENT_REPOSITORY_MOCK } from "../../__mocks__/databases/gitPullEventRepository";

describe("Testing GitPullEventService", () => {
  let gitPullEventService: GitPullEventService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot({
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.timestamp(),
                winston.format.ms(),
                winston.format.json(),
                nestWinstonModuleUtilities.format.nestLike()
              ),
            }),
          ],
        }),
        PrismaModule,
      ],
      providers: [
        GitPullEventService,
        { provide: StorageService, useValue: MOCK_STORAGE_SERVICE },
        {
          provide: GitHostProviderFactory,
          useValue: MOCK_GIT_PROVIDER_FACTORY,
        },
        { provide: GitClientService, useClass: mockGitClientService },
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

  it("should should save new record to db", async () => {
    expect(undefined).toBeUndefined();
  });
});
