import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import * as classTransformer from "class-transformer";
import axios from "axios";

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

const { plainToInstance } = classTransformer;
const spyOnAxiosPost = jest.spyOn(axios, "post");

describe("BuildRunnerController", () => {
  let controller: BuildRunnerController;
  let loggerService: AmplicationLogger;
  let configService: ConfigService;

  const mockRunnerServiceCopyFromJobToArtifact = jest.fn();
  const mockRunnerServiceSaveDsgResourceData = jest.fn();
  const mockRunnerServiceGetCodeGeneratorVersion = jest.fn();
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
            saveDsgResourceData: mockRunnerServiceSaveDsgResourceData,
            copyFromJobToArtifact: mockRunnerServiceCopyFromJobToArtifact,
            getCodeGeneratorVersion: mockRunnerServiceGetCodeGeneratorVersion,
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
        MockedAmplicationLoggerProvider,
      ],
    }).compile();

    controller = module.get<BuildRunnerController>(BuildRunnerController);
    configService = module.get<ConfigService>(ConfigService);
    loggerService = module.get<AmplicationLogger>(AmplicationLogger);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("On code generation success, copy file and/or directories from `jobPath` to `artifactPath` and emit Kafka success event", async () => {
    const codeGenerationSuccessDTOMock: CodeGenerationSuccessDto = {
      resourceId: "resourceId",
      buildId: "buildId",
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
    await expect(mockKafkaServiceEmitMessage()).resolves.not.toThrow();
  });

  it("On code generation success with unhandled exception thrown, log `error.message` with log level `error` and emit Kafka failure event", async () => {
    const errorMock = new Error("Test error");
    const codeGenerationSuccessDTOMock: CodeGenerationSuccessDto = {
      resourceId: "resourceId",
      buildId: "buildId",
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
    await expect(mockKafkaServiceEmitMessage()).resolves.not.toThrow();
  });

  it("On code generation failure, log `error.message` with log level `error` and emit Kafka failure event", async () => {
    const errorMock = new Error("Test error");
    const codeGenerationFailureDTOMock: CodeGenerationFailureDto = {
      resourceId: "resourceId",
      buildId: "buildId",
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
    await expect(mockKafkaServiceEmitMessage()).resolves.not.toThrow();
  });

  it("On code generation failure and unhandled exception thrown log `error.message` with log level `error`", async () => {
    const errorMock = new Error("Test error");
    const codeGenerationFailureDTOMock: CodeGenerationFailureDto = {
      resourceId: "resourceId",
      buildId: "buildId",
      error: errorMock,
    };
    const expectedCodeGeneratorVersion = "v1.2.2";
    mockRunnerServiceGetCodeGeneratorVersion.mockResolvedValue(
      expectedCodeGeneratorVersion
    );

    const kafkaFailureEventMock: CodeGenerationFailure.KafkaEvent = {
      key: null,
      value: {
        buildId: codeGenerationFailureDTOMock.buildId,
        error: errorMock,
        codeGeneratorVersion: expectedCodeGeneratorVersion,
      },
    } as unknown as CodeGenerationFailure.KafkaEvent;

    mockKafkaServiceEmitMessage.mockRejectedValue(errorMock);

    await controller.onCodeGenerationFailure(codeGenerationFailureDTOMock);

    expect(mockKafkaServiceEmitMessage).toBeCalledWith(
      KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
      kafkaFailureEventMock
    );
    await expect(
      async () => await mockKafkaServiceEmitMessage()
    ).rejects.toThrow(errorMock);

    expect(loggerService.error).toBeCalledWith(errorMock.message, errorMock);
  });

  it("On code generation request save DSG resource data and send it to DSG runner", async () => {
    const expectedCodeGeneratorVersion = "v1.2.2";
    const codeGenerationRequestDTOMock: CodeGenerationRequest.Value = {
      resourceId: "resourceId",
      buildId: "buildId",
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
    const args = plainToInstance(
      CodeGenerationRequest.Value,
      codeGenerationRequestDTOMock
    );

    mockRunnerServiceSaveDsgResourceData.mockResolvedValue(undefined);
    spyOnAxiosPost.mockResolvedValue({
      data: {
        message: "Success",
      },
    });

    mockCodeGeneratorServiceGetCodeGeneratorVersion.mockResolvedValue(
      expectedCodeGeneratorVersion
    );

    await controller.onCodeGenerationRequest(codeGenerationRequestDTOMock);

    expect(loggerService.info).toBeCalled();
    expect(mockRunnerServiceSaveDsgResourceData).toBeCalledWith(
      args.buildId,
      args.dsgResourceData,
      expectedCodeGeneratorVersion
    );
    expect(spyOnAxiosPost).toBeCalledWith(
      configService.get(Env.DSG_RUNNER_URL),
      {
        resourceId: args.resourceId,
        buildId: args.buildId,
        containerImageTag: expectedCodeGeneratorVersion,
      }
    );
    await expect(
      axios.post(configService.get(Env.DSG_RUNNER_URL), {
        resourceId: args.resourceId,
        buildId: args.buildId,
        containerImageTag: expectedCodeGeneratorVersion,
      })
    ).resolves.toEqual(
      expect.objectContaining({
        data: {
          message: "Success",
        },
      })
    );
  });

  it("On code generation request with unhandled exception thrown, log `error.message` with log level `error` and emit Kafka failure event", async () => {
    const errorMock = new Error("Test error");
    const expectedCodeGeneratorVersion = "v1.2.2";
    const codeGenerationRequestDTOMock: CodeGenerationRequest.Value = {
      resourceId: "resourceId",
      buildId: "buildId",
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

    const kafkaFailureEventMock: CodeGenerationFailure.KafkaEvent = {
      key: null,
      value: <CodeGenerationFailure.Value>{
        buildId: codeGenerationRequestDTOMock.buildId,
        error: errorMock,
        codeGeneratorVersion: expectedCodeGeneratorVersion,
      },
    } as unknown as CodeGenerationFailure.KafkaEvent;

    mockKafkaServiceEmitMessage.mockResolvedValue(undefined);
    mockRunnerServiceSaveDsgResourceData.mockRejectedValue(errorMock);
    mockCodeGeneratorServiceGetCodeGeneratorVersion.mockResolvedValue(
      expectedCodeGeneratorVersion
    );

    await controller.onCodeGenerationRequest(codeGenerationRequestDTOMock);

    expect(loggerService.error).toBeCalledWith(errorMock.message, errorMock);
    expect(mockKafkaServiceEmitMessage).toBeCalledWith(
      KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
      kafkaFailureEventMock
    );
    await expect(mockKafkaServiceEmitMessage()).resolves.not.toThrow();
  });
});
