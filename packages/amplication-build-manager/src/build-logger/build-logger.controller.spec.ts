import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";

import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { CodeGenerationLog, KAFKA_TOPICS } from "@amplication/schema-registry";
import { BuildLoggerController } from "./build-logger.controller";
import { CodeGenerationLogRequestDto } from "./dto/OnCodeGenerationLogRequest";
import { BuildJobsHandlerService } from "../build-job-handler/build-job-handler.service";
import { EnumDomainName } from "../types";

describe("Build Logger Controller", () => {
  let controller: BuildLoggerController;
  let buildJobsHandlerService: BuildJobsHandlerService;
  const mockBuildJobsHandlerServiceExtractBuildId = jest.fn();
  const mockBuildJobsHandlerServiceExtractDomain = jest.fn();

  const mockServiceEmitMessage = jest
    .fn()
    .mockImplementation(
      (topic: string, message: CodeGenerationLog.KafkaEvent) =>
        Promise.resolve()
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BuildLoggerController],
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
      ],
    }).compile();

    controller = module.get<BuildLoggerController>(BuildLoggerController);
    buildJobsHandlerService = module.get<BuildJobsHandlerService>(
      BuildJobsHandlerService
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
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

    await controller.onCodeGenerationLog(mockRequestLogDOT);

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

      await controller.onCodeGenerationLog(mockRequestLogDOT);

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
