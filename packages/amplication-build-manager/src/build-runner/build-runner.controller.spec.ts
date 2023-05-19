import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import * as classTransformer from "class-transformer";
import axios from "axios";

import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import {
  CodeGenerationFailure,
  CodeGenerationSuccess,
} from "@amplication/schema-registry";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";

import { Env } from "../env";
import { BuildRunnerController } from "./build-runner.controller";
import { BuildRunnerService } from "./build-runner.service";
import { CodeGenerationSuccessDto } from "./dto/CodeGenerationSuccess";
import { CodeGenerationFailureDto } from "./dto/CodeGenerationFailure";
import { CodeGenerationRequestDto } from "./dto/CodeGenerationRequest";

const { plainToInstance } = classTransformer;
const spyOnPlainToInstance = jest.spyOn(classTransformer, "plainToInstance");
const spyOnAxiosPost = jest.spyOn(axios, "post");

describe("BuildRunnerController", () => {
  let controller: BuildRunnerController;
  let loggerService: AmplicationLogger;
  let configService: ConfigService;

  const mockRunnerServiceCopyFromJobToArtifact = jest.fn();
  const mockRunnerServiceSaveDsgResourceData = jest.fn();
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
          })),
        },
        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case Env.CODE_GENERATION_SUCCESS_TOPIC:
                  return "code_generation_success_topic";
                case Env.CODE_GENERATION_FAILURE_TOPIC:
                  return "code_generation_failure_topic";
                case Env.DSG_RUNNER_URL:
                  return "http://runner.url/";
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
    const kafkaSuccessEventMock: CodeGenerationSuccess.KafkaEvent = {
      key: null,
      value: { buildId: codeGenerationSuccessDTOMock.buildId },
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
      configService.get(Env.CODE_GENERATION_SUCCESS_TOPIC),
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
    const kafkaFailureEventMock: CodeGenerationFailure.KafkaEvent = {
      key: null,
      value: {
        buildId: codeGenerationSuccessDTOMock.buildId,
        error: errorMock,
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
      configService.get(Env.CODE_GENERATION_FAILURE_TOPIC),
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
    const kafkaFailureEventMock: CodeGenerationFailure.KafkaEvent = {
      key: null,
      value: {
        buildId: codeGenerationFailureDTOMock.buildId,
        error: errorMock,
      },
    } as unknown as CodeGenerationFailure.KafkaEvent;

    mockKafkaServiceEmitMessage.mockResolvedValue(undefined);

    await controller.onCodeGenerationFailure(codeGenerationFailureDTOMock);

    expect(mockKafkaServiceEmitMessage).toBeCalledWith(
      configService.get(Env.CODE_GENERATION_FAILURE_TOPIC),
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
    const kafkaFailureEventMock: CodeGenerationFailure.KafkaEvent = {
      key: null,
      value: {
        buildId: codeGenerationFailureDTOMock.buildId,
        error: errorMock,
      },
    } as unknown as CodeGenerationFailure.KafkaEvent;

    mockKafkaServiceEmitMessage.mockRejectedValue(errorMock);

    await controller.onCodeGenerationFailure(codeGenerationFailureDTOMock);

    expect(mockKafkaServiceEmitMessage).toBeCalledWith(
      configService.get(Env.CODE_GENERATION_FAILURE_TOPIC),
      kafkaFailureEventMock
    );
    await expect(
      async () => await mockKafkaServiceEmitMessage()
    ).rejects.toThrow(errorMock);

    expect(loggerService.error).toBeCalledWith(errorMock.message, errorMock);
  });

  it("On code generation request save DSG resource data and send it to DSG runner", async () => {
    const codeGenerationRequestDTOMock: CodeGenerationRequestDto = {
      resourceId: "resourceId",
      buildId: "buildId",
      dsgResourceData: {
        resourceType: "Service",
        buildId: "12345",
        pluginInstallations: [],
      },
    };
    const args = plainToInstance(
      CodeGenerationRequestDto,
      codeGenerationRequestDTOMock
    );

    mockRunnerServiceSaveDsgResourceData.mockResolvedValue(undefined);
    spyOnAxiosPost.mockResolvedValue({
      data: {
        message: "Success",
      },
    });

    await controller.onCodeGenerationRequest(codeGenerationRequestDTOMock);

    expect(loggerService.info).toBeCalled();
    expect(spyOnPlainToInstance).toBeCalledWith(
      CodeGenerationRequestDto,
      codeGenerationRequestDTOMock
    );
    expect(loggerService.debug).toBeCalled();
    expect(mockRunnerServiceSaveDsgResourceData).toBeCalledWith(
      args.buildId,
      args.dsgResourceData
    );
    expect(spyOnAxiosPost).toBeCalledWith(
      configService.get(Env.DSG_RUNNER_URL),
      {
        resourceId: args.resourceId,
        buildId: args.buildId,
      }
    );
    await expect(
      axios.post(configService.get(Env.DSG_RUNNER_URL), {
        resourceId: args.resourceId,
        buildId: args.buildId,
      })
    ).resolves.toEqual(
      expect.objectContaining({
        data: {
          message: "Success",
        },
      })
    );
  });

  it("On code generation rqeuest with unhandled exception thrown, log `error.message` with log level `error` and emit Kafka failure event", async () => {
    const errorMock = new Error("Test error");
    const codeGenerationRequestDTOMock: CodeGenerationRequestDto = {
      resourceId: "resourceId",
      buildId: "buildId",
      dsgResourceData: {
        resourceType: "Service",
        buildId: "12345",
        pluginInstallations: [],
      },
    };
    const kafkaFailureEventMock: CodeGenerationFailure.KafkaEvent = {
      key: null,
      value: {
        buildId: codeGenerationRequestDTOMock.buildId,
        error: errorMock,
      },
    } as unknown as CodeGenerationFailure.KafkaEvent;

    mockKafkaServiceEmitMessage.mockResolvedValue(undefined);
    mockRunnerServiceSaveDsgResourceData.mockRejectedValue(errorMock);

    await controller.onCodeGenerationRequest(codeGenerationRequestDTOMock);

    expect(loggerService.error).toBeCalledWith(errorMock.message, errorMock);
    expect(mockKafkaServiceEmitMessage).toBeCalledWith(
      configService.get(Env.CODE_GENERATION_FAILURE_TOPIC),
      kafkaFailureEventMock
    );
    await expect(mockKafkaServiceEmitMessage()).resolves.not.toThrow();
  });
});
