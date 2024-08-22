import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { CodeGenerationLog, KAFKA_TOPICS } from "@amplication/schema-registry";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { BuildJobsHandlerService } from "../build-job-handler/build-job-handler.service";
import { BuildLoggerController } from "./build-logger.controller";
import { BuildLoggerService } from "./build-logger.service";
import { CodeGenerationLogRequestDto } from "./dto/OnCodeGenerationLogRequest";

const addCodeGenerationLogMock = jest.fn();

describe("Build Logger Controller", () => {
  let controller: BuildLoggerController;
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
          provide: BuildLoggerService,
          useClass: jest.fn(() => ({
            addCodeGenerationLog: addCodeGenerationLogMock,
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
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should emit `CodeGenerationLog.KafkaEvent` message on Kafka producer service", async () => {
    const mockRequestLogDOT: CodeGenerationLogRequestDto = {
      buildId: "buildID",
      level: "info",
      message: "test message",
    };

    await controller.onCodeGenerationLog(mockRequestLogDOT);

    expect(addCodeGenerationLogMock).toBeCalledWith(mockRequestLogDOT);
  });
});
