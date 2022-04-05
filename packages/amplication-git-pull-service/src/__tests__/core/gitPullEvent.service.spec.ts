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
import { EventData } from "../../contracts/interfaces/eventData";
import { GitProviderEnum } from "../../contracts/enums/gitProvider.enum";
import { EnumGitPullEventStatus } from "../../contracts/enums/gitPullEventStatus.enum";
import path from "path";
import * as winston from "winston";
import { utilities as nestWinstonModuleUtilities } from "nest-winston/dist/winston.utilities";
import { NEW_RECORD } from "../../__mocks__/mockData";

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
        { provide: GitClientService, useValue: MOCK_GIT_CLIENT_SERVICE },
        {
          provide: GitPullEventRepository,
          useClass: jest.fn(() => ({
            create: jest.fn(() => NEW_RECORD),
            update: jest.fn(() => ({
              ...NEW_RECORD,
              status: EnumGitPullEventStatus.Ready,
            })),
            getPreviousReadyCommit: jest.fn(() => ({
              ...NEW_RECORD,
              status: EnumGitPullEventStatus.Ready,
            })),
          })),
        },
      ],
    }).compile();

    gitPullEventService = module.get<GitPullEventService>(GitPullEventService);
  });

  it("should be defined", () => {
    expect(gitPullEventService).toBeDefined();
  });

  it("should should save new record to db", async () => {
    // arrange
    const eventData: EventData = {
      id: BigInt(112233),
      provider: GitProviderEnum.Github,
      repositoryOwner: "amit-amp-org",
      repositoryName: "sample-test",
      branch: "main",
      commit: "11erf44",
      status: EnumGitPullEventStatus.Created,
      pushedAt: new Date(),
    };

    const baseDir = path.resolve("/git-remote-test");
    const remote = "origin";
    const installationId = "24226448";
    const skip = 0;

    // act
    const result = await gitPullEventService.pushEventHandler(
      eventData,
      baseDir,
      remote,
      installationId,
      skip
    );

    // assert
    expect(result).toBeUndefined();
  });

  it("should should pull a repository and update status to Ready", async () => {});

  it("should should pull a repository and update status to Deleted", async () => {});
});
