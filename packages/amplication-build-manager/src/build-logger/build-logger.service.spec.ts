import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

import { CodeGenerationLog, KAFKA_TOPICS } from "@amplication/schema-registry";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { BuildJobsHandlerService } from "../build-job-handler/build-job-handler.service";
import { EnumDomainName } from "../types";
import { BuildLoggerService } from "./build-logger.service";
import { CodeGenerationLogRequestDto } from "./dto/OnCodeGenerationLogRequest";

const mockServiceEmitMessage = jest
  .fn()
  .mockImplementation((topic: string, message: CodeGenerationLog.KafkaEvent) =>
    Promise.resolve()
  );

const mockBuildJobsHandlerServiceExtractBuildId = jest.fn();
const mockBuildJobsHandlerServiceExtractDomain = jest.fn();

describe("BuildLoggerService", () => {
  let service: BuildLoggerService;
  let buildJobsHandlerService: BuildJobsHandlerService;

  beforeAll(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: KafkaProducerService,
          useClass: jest.fn(() => ({
            emitMessage: mockServiceEmitMessage,
          })),
        },

        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case KAFKA_TOPICS.DSG_LOG_TOPIC:
                  return "log_topic";
                default:
                  return "";
              }
            },
          },
        },
        {
          provide: BuildJobsHandlerService,
          useValue: {
            extractBuildId: mockBuildJobsHandlerServiceExtractBuildId,
            extractDomain: mockBuildJobsHandlerServiceExtractDomain,
          },
        },
        BuildLoggerService,
      ],
    }).compile();

    service = module.get<BuildLoggerService>(BuildLoggerService);
    buildJobsHandlerService = module.get<BuildJobsHandlerService>(
      BuildJobsHandlerService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should emit `CodeGenerationLog.KafkaEvent` message on Kafka producer service", async () => {
    const spyOnBuildJobsHandlerServiceExtractBuildId = jest
      .spyOn(buildJobsHandlerService, "extractBuildId")
      .mockReturnValue("buildID");

    const mockRequestLogDOT: CodeGenerationLogRequestDto = {
      buildId: "buildID",
      level: "info",
      message: "test message",
    };

    const logEvent: CodeGenerationLog.KafkaEvent = {
      key: { buildId: mockRequestLogDOT.buildId },
      value: mockRequestLogDOT,
    };

    await service.addCodeGenerationLog(mockRequestLogDOT);

    expect(mockServiceEmitMessage).toBeCalledWith(
      KAFKA_TOPICS.DSG_LOG_TOPIC,
      logEvent
    );

    expect(spyOnBuildJobsHandlerServiceExtractBuildId).toBeCalledTimes(1);
    await expect(mockServiceEmitMessage()).resolves.not.toThrow();
  });

  it.each([EnumDomainName.Server, EnumDomainName.AdminUI])(
    "should emit `CodeGenerationLog.KafkaEvent` message with log message prefixed with job domain when exists",
    async (domain) => {
      const buildId = `buildID`;
      const jobBuildId = `${buildId}-${domain}`;
      mockBuildJobsHandlerServiceExtractBuildId.mockReturnValue(buildId);
      mockBuildJobsHandlerServiceExtractDomain.mockReturnValue(domain);

      const mockRequestLogDOT: CodeGenerationLogRequestDto = {
        buildId: jobBuildId,
        level: "info",
        message: "test message",
      };

      const logEvent: CodeGenerationLog.KafkaEvent = {
        key: { buildId },
        value: mockRequestLogDOT,
      };

      await service.addCodeGenerationLog(mockRequestLogDOT);

      expect(mockServiceEmitMessage).toBeCalledWith(
        KAFKA_TOPICS.DSG_LOG_TOPIC,
        {
          ...logEvent,
          value: {
            buildId,
            level: mockRequestLogDOT.level,
            message: `[${domain}] test message`,
          },
        }
      );

      expect(mockBuildJobsHandlerServiceExtractBuildId).toBeCalledTimes(1);
      expect(mockBuildJobsHandlerServiceExtractDomain).toBeCalledTimes(1);
    }
  );
});
