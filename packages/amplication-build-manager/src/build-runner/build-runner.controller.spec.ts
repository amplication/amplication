import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import {
  CodeGenerationFailure,
  CodeGenerationRequest,
  CodeGenerationSuccess,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types/models";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";

import { Env } from "../env";
import { BuildRunnerController } from "./build-runner.controller";
import { BuildRunnerService } from "./build-runner.service";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";
import { CodeGenerationSuccessDto } from "./dto/CodeGenerationSuccess";
import { CodeGenerationFailureDto } from "./dto/CodeGenerationFailure";
import { AppInfo } from "@amplication/code-gen-types";
import { CodeGeneratorSplitterService } from "../code-generator/code-generator-splitter.service";

describe("BuildRunnerController", () => {
  let controller: BuildRunnerController;
  let loggerService: AmplicationLogger;
  let codeGeneratorSplitterService: CodeGeneratorSplitterService;

  const mockRunnerServiceCopyFromJobToArtifact = jest.fn();
  const mockRunnerServiceGetCodeGeneratorVersion = jest.fn();
  const mockRunnerServiceRunJobs = jest.fn();
  const mockCodeGeneratorServiceGetCodeGeneratorVersion = jest.fn();
  const mockKafkaServiceEmitMessage = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BuildRunnerController],
      providers: [
        {
          provide: KafkaProducerService,
          useClass: jest.fn(() => ({
            emitMessage: mockKafkaServiceEmitMessage,
          })),
        },
        {
          provide: BuildRunnerService,
          useClass: jest.fn(() => ({
            copyFromJobToArtifact: mockRunnerServiceCopyFromJobToArtifact,
            getCodeGeneratorVersion: mockRunnerServiceGetCodeGeneratorVersion,
            runJobs: mockRunnerServiceRunJobs,
          })),
        },
        {
          provide: CodeGeneratorService,
          useClass: jest.fn(() => ({
            getCodeGeneratorVersion:
              mockCodeGeneratorServiceGetCodeGeneratorVersion,
          })),
        },
        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case KAFKA_TOPICS.CODE_GENERATION_SUCCESS_TOPIC:
                  return "code_generation_success_topic";
                case KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC:
                  return "code_generation_failure_topic";
                case Env.DSG_RUNNER_URL:
                  return "http://runner.url/";
                case Env.DSG_CATALOG_SERVICE_URL:
                  return "http://catalog.url/";
                default:
                  return "";
              }
            },
          },
        },
        {
          provide: CodeGeneratorSplitterService,
          useValue: {
            extractBuildId: jest.fn(),
          },
        },
        MockedAmplicationLoggerProvider,
      ],
    }).compile();

    controller = module.get<BuildRunnerController>(BuildRunnerController);
    loggerService = module.get<AmplicationLogger>(AmplicationLogger);
    codeGeneratorSplitterService = module.get<CodeGeneratorSplitterService>(
      CodeGeneratorSplitterService
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("On code generation success, copy file and/or directories from `jobPath` to `artifactPath` and emit Kafka success event", async () => {
    const buildId = "buildId";
    const spyOnCodeGeneratorSplitterServiceExtractBuildId = jest
      .spyOn(codeGeneratorSplitterService, "extractBuildId")
      .mockReturnValue(buildId);

    const codeGenerationSuccessDTOMock: CodeGenerationSuccessDto = {
      resourceId: "resourceId",
      buildId: buildId,
    };

    const expectedCodeGeneratorVersion = "v1.2.2";
    mockRunnerServiceGetCodeGeneratorVersion.mockResolvedValue(
      expectedCodeGeneratorVersion
    );

    const kafkaSuccessEventMock: CodeGenerationSuccess.KafkaEvent = {
      key: null,
      value: {
        buildId: codeGenerationSuccessDTOMock.buildId,
        codeGeneratorVersion: expectedCodeGeneratorVersion,
      },
    };

    mockRunnerServiceCopyFromJobToArtifact.mockResolvedValue(undefined);
    mockKafkaServiceEmitMessage.mockResolvedValue(undefined);

    await controller.onCodeGenerationSuccess(codeGenerationSuccessDTOMock);

    expect(mockRunnerServiceCopyFromJobToArtifact).toBeCalledWith(
      codeGenerationSuccessDTOMock.resourceId,
      codeGenerationSuccessDTOMock.buildId
    );
    await expect(
      mockRunnerServiceCopyFromJobToArtifact()
    ).resolves.not.toThrow();

    expect(mockKafkaServiceEmitMessage).toBeCalledWith(
      KAFKA_TOPICS.CODE_GENERATION_SUCCESS_TOPIC,
      kafkaSuccessEventMock
    );

    expect(spyOnCodeGeneratorSplitterServiceExtractBuildId).toBeCalledTimes(1);
    await expect(mockKafkaServiceEmitMessage()).resolves.not.toThrow();
  });

  it("On code generation success with unhandled exception thrown, log `error.message` with log level `error` and emit Kafka failure event", async () => {
    const buildId = "buildId";
    const spyOnCodeGeneratorSplitterServiceExtractBuildId = jest
      .spyOn(codeGeneratorSplitterService, "extractBuildId")
      .mockReturnValue(buildId);

    const errorMock = new Error("Test error");
    const codeGenerationSuccessDTOMock: CodeGenerationSuccessDto = {
      resourceId: "resourceId",
      buildId: buildId,
    };
    const expectedCodeGeneratorVersion = "v1.2.2";
    mockRunnerServiceGetCodeGeneratorVersion.mockResolvedValue(
      expectedCodeGeneratorVersion
    );

    const kafkaFailureEventMock: CodeGenerationFailure.KafkaEvent = {
      key: null,
      value: <CodeGenerationFailure.Value>{
        buildId: codeGenerationSuccessDTOMock.buildId,
        error: errorMock,
        codeGeneratorVersion: expectedCodeGeneratorVersion,
      },
    } as unknown as CodeGenerationFailure.KafkaEvent;

    mockRunnerServiceCopyFromJobToArtifact.mockRejectedValue(errorMock);
    mockKafkaServiceEmitMessage.mockResolvedValue(undefined);

    await controller.onCodeGenerationSuccess(codeGenerationSuccessDTOMock);

    expect(mockRunnerServiceCopyFromJobToArtifact).toBeCalledWith(
      codeGenerationSuccessDTOMock.resourceId,
      codeGenerationSuccessDTOMock.buildId
    );
    await expect(
      async () => await mockRunnerServiceCopyFromJobToArtifact()
    ).rejects.toThrow(errorMock);

    expect(mockKafkaServiceEmitMessage).toBeCalledWith(
      KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
      kafkaFailureEventMock
    );

    expect(spyOnCodeGeneratorSplitterServiceExtractBuildId).toBeCalledTimes(1);
    await expect(mockKafkaServiceEmitMessage()).resolves.not.toThrow();
  });

  it("On code generation failure, log `error.message` with log level `error` and emit Kafka failure event", async () => {
    const errorMock = new Error("Test error");
    const buildId = "buildId";
    const spyOnCodeGeneratorSplitterServiceExtractBuildId = jest
      .spyOn(codeGeneratorSplitterService, "extractBuildId")
      .mockReturnValue(buildId);
    const codeGenerationFailureDTOMock: CodeGenerationFailureDto = {
      resourceId: "resourceId",
      buildId: buildId,
      error: errorMock,
    };
    const expectedCodeGeneratorVersion = "v1.2.2";
    mockRunnerServiceGetCodeGeneratorVersion.mockResolvedValue(
      expectedCodeGeneratorVersion
    );

    const kafkaFailureEventMock: CodeGenerationFailure.KafkaEvent = {
      key: null,
      value: <CodeGenerationFailure.Value>{
        buildId: codeGenerationFailureDTOMock.buildId,
        error: errorMock,
        codeGeneratorVersion: expectedCodeGeneratorVersion,
      },
    } as unknown as CodeGenerationFailure.KafkaEvent;

    mockKafkaServiceEmitMessage.mockResolvedValue(undefined);

    await controller.onCodeGenerationFailure(codeGenerationFailureDTOMock);

    expect(mockKafkaServiceEmitMessage).toBeCalledWith(
      KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
      kafkaFailureEventMock
    );

    expect(spyOnCodeGeneratorSplitterServiceExtractBuildId).toBeCalledTimes(1);
    await expect(mockKafkaServiceEmitMessage()).resolves.not.toThrow();
  });

  describe("on code generation request", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should successfully trigger DSG jobs", async () => {
      const expectedCodeGeneratorVersion = "v1.2.2";
      const expectedResourceId = "resourceId";
      const expectedBuildId = "buildId";
      const codeGenerationRequestDTOMock: CodeGenerationRequest.Value = {
        resourceId: expectedResourceId,
        buildId: expectedBuildId,
        dsgResourceData: {
          resourceType: "Service",
          buildId: "12345",
          pluginInstallations: [],
          resourceInfo: {
            codeGeneratorVersionOptions: {
              version: expectedCodeGeneratorVersion,
              selectionStrategy: CodeGeneratorVersionStrategy.Specific,
            },
          } as unknown as AppInfo,
        },
      };

      mockCodeGeneratorServiceGetCodeGeneratorVersion.mockResolvedValue(
        expectedCodeGeneratorVersion
      );

      mockRunnerServiceRunJobs.mockResolvedValue(undefined);
      await controller.onCodeGenerationRequest(codeGenerationRequestDTOMock);
      expect(mockRunnerServiceRunJobs).toBeCalledWith(
        expectedResourceId,
        expectedBuildId,
        codeGenerationRequestDTOMock.dsgResourceData,
        expectedCodeGeneratorVersion
      );
    });

    it("should emit code generation failure event when the trigger DSG jobs fails", async () => {
      //const errorMock = new Error("Test error");
      const expectedCodeGeneratorVersion = "v1.2.2";
      const expectedResourceId = "resourceId";
      const expectedBuildId = "buildId";
      const codeGenerationRequestDTOMock: CodeGenerationRequest.Value = {
        resourceId: expectedResourceId,
        buildId: expectedBuildId,
        dsgResourceData: {
          resourceType: "Service",
          buildId: expectedBuildId,
          pluginInstallations: [],
          resourceInfo: {
            codeGeneratorVersionOptions: {
              version: expectedCodeGeneratorVersion,
              selectionStrategy: CodeGeneratorVersionStrategy.Specific,
            },
          } as unknown as AppInfo,
        },
      };
      mockCodeGeneratorServiceGetCodeGeneratorVersion.mockResolvedValue(
        expectedCodeGeneratorVersion
      );
      const kafkaFailureEventMock: CodeGenerationFailure.KafkaEvent = {
        key: null,
        value: <CodeGenerationFailure.Value>{
          buildId: codeGenerationRequestDTOMock.buildId,
          error: new Error("Test error"),
          codeGeneratorVersion: expectedCodeGeneratorVersion,
        },
      } as unknown as CodeGenerationFailure.KafkaEvent;

      mockRunnerServiceRunJobs.mockRejectedValue(new Error("Test error"));

      await controller.onCodeGenerationRequest(codeGenerationRequestDTOMock);

      expect(mockRunnerServiceRunJobs).toBeCalledWith(
        expectedResourceId,
        expectedBuildId,
        codeGenerationRequestDTOMock.dsgResourceData,
        expectedCodeGeneratorVersion
      );

      expect(loggerService.error).toBeCalledWith(
        "Test error",
        new Error("Test error")
      );
      expect(mockKafkaServiceEmitMessage).toBeCalledWith(
        KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
        kafkaFailureEventMock
      );
    });
  });
});
