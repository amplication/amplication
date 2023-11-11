import { join, dirname } from "node:path";
import { MakeDirectoryOptions, promises } from "node:fs";

import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import fsExtra from "fs-extra";

import { DSGResourceData } from "@amplication/code-gen-types";

import { BuildRunnerService } from "./build-runner.service";
import { Env } from "../env";
import { CodeGeneratorSplitterService } from "../code-generator/code-generator-splitter.service";
import { EnumDomainName, EnumJobStatus } from "../types";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import {
  CodeGenerationFailure,
  CodeGenerationSuccess,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";

const spyOnMkdir = jest.spyOn(promises, "mkdir");
const spyOnWriteFile = jest.spyOn(promises, "writeFile");
const spyOnFsExtraCopy = jest.spyOn(fsExtra, "copy");

spyOnMkdir.mockImplementation(
  (dirName: string, options: MakeDirectoryOptions) => {
    return Promise.resolve(
      options?.recursive ? dirName.split("/").shift() : undefined
    );
  }
);
spyOnWriteFile.mockResolvedValue(undefined);
spyOnFsExtraCopy.mockImplementation((src: string, dest: string) =>
  Promise.resolve()
);

describe("BuildRunnerService", () => {
  let service: BuildRunnerService;
  let configService: ConfigService;
  let codeGeneratorSplitterService: CodeGeneratorSplitterService;
  const mockCodeGeneratorServiceGetCodeGeneratorVersion = jest.fn();
  const mockKafkaServiceEmitMessage = jest.fn();

  beforeAll(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
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
                case Env.DSG_JOBS_BASE_FOLDER:
                  return "dsg/jobs/base-dir/";
                case Env.DSG_JOBS_RESOURCE_DATA_FILE:
                  return "dsg/jobs/resource-data-file/";
                case Env.DSG_JOBS_CODE_FOLDER:
                  return "dsg/jobs/code-dir/";
                case Env.BUILD_ARTIFACTS_BASE_FOLDER:
                  return "build/artifacts/base-dir/";
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
            splitBuildsIntoJobs: jest.fn(),
            getBuildStatus: jest.fn(),
            getJobStatus: jest.fn(),
            setJobStatus: jest.fn(),
          },
        },
        {
          provide: CodeGeneratorService,
          useClass: jest.fn(() => ({
            getCodeGeneratorVersion:
              mockCodeGeneratorServiceGetCodeGeneratorVersion,
          })),
        },
        {
          provide: KafkaProducerService,
          useClass: jest.fn(() => ({
            emitMessage: mockKafkaServiceEmitMessage,
          })),
        },
        MockedAmplicationLoggerProvider,
        BuildRunnerService,
      ],
    }).compile();

    service = module.get<BuildRunnerService>(BuildRunnerService);
    configService = module.get<ConfigService>(ConfigService);
    codeGeneratorSplitterService = module.get<CodeGeneratorSplitterService>(
      CodeGeneratorSplitterService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should save DSG resource data in the appropriate dir, based on the `buildId`", async () => {
    const buildId = "buildId";
    const dsgResourceDataMock: DSGResourceData = {
      buildId,
      resourceType: "Service",
      pluginInstallations: [],
    };
    const codeGeneratorVersion = "v1.0.0";

    await service.saveDsgResourceData(
      buildId,
      dsgResourceDataMock,
      codeGeneratorVersion
    );

    const savePath = join(
      configService.get(Env.DSG_JOBS_BASE_FOLDER),
      buildId,
      configService.get(Env.DSG_JOBS_RESOURCE_DATA_FILE)
    );
    const dirName = dirname(savePath);

    expect(spyOnMkdir).toBeCalledWith(dirName, { recursive: true });
    await expect(promises.mkdir(dirName, { recursive: true })).resolves.toEqual(
      configService.get(Env.DSG_JOBS_BASE_FOLDER).split("/").shift()
    );

    expect(spyOnWriteFile).toBeCalledWith(
      savePath,
      JSON.stringify({ ...dsgResourceDataMock, codeGeneratorVersion })
    );
    await expect(
      promises.writeFile(
        savePath,
        JSON.stringify({ ...dsgResourceDataMock, codeGeneratorVersion })
      )
    ).resolves.not.toThrow();
  });

  describe("copyFromJobToArtifact", () => {
    it("should copy file and/or directories from `jobPath` to `artifactPath` and return true", async () => {
      const resourceId = "resourceId";
      const buildId = "buildId";

      const spyOnCodeGeneratorSplitterServiceExtractBuildId = jest
        .spyOn(codeGeneratorSplitterService, "extractBuildId")
        .mockReturnValue(buildId);

      const jobPath = join(
        configService.get(Env.DSG_JOBS_BASE_FOLDER),
        buildId,
        configService.get(Env.DSG_JOBS_CODE_FOLDER)
      );
      const artifactPath = join(
        configService.get(Env.BUILD_ARTIFACTS_BASE_FOLDER),
        resourceId,
        buildId
      );

      const result = await service.copyFromJobToArtifact(resourceId, buildId);

      expect(spyOnCodeGeneratorSplitterServiceExtractBuildId).toBeCalledTimes(
        1
      );
      expect(spyOnFsExtraCopy).toBeCalledWith(jobPath, artifactPath);
      expect(result).toBe(true);
      await expect(fsExtra.copy(jobPath, artifactPath)).resolves.not.toThrow();
    });

    it("should return false when it gets to the catch block", async () => {
      const resourceId = "resourceId";
      const buildId = "buildId";

      const spyOnCodeGeneratorSplitterServiceExtractBuildId = jest
        .spyOn(codeGeneratorSplitterService, "extractBuildId")
        .mockReturnValue(buildId);

      spyOnFsExtraCopy.mockImplementationOnce(() => {
        throw new Error("Error");
      });

      const result = await service.copyFromJobToArtifact(resourceId, buildId);

      expect(spyOnCodeGeneratorSplitterServiceExtractBuildId).toBeCalledTimes(
        1
      );
      expect(spyOnFsExtraCopy).toBeCalledTimes(1);
      expect(result).toBe(false);
    });
  });
  describe("emitKafkaEventBasedOnJobStatus", () => {
    const resourceId = "resourceId";
    const buildId = "buildId";

    const testCases = [
      [
        {
          //input
          jobBuildId: `${buildId}-${EnumDomainName.Server}`,
          jobStatus: EnumJobStatus.Success,
          otherJobsCombinedStatus: EnumJobStatus.InProgress,
        },
        {
          //expectation
          eventEmission: "NONE",
        },
      ],
      [
        {
          //input
          jobBuildId: `${buildId}-${EnumDomainName.Server}`,
          jobStatus: EnumJobStatus.Success,
          otherJobsCombinedStatus: EnumJobStatus.Success,
        },
        {
          //expectation
          eventEmission: "SUCCESS",
        },
      ],
      [
        {
          //input
          jobBuildId: `${buildId}-${EnumDomainName.Server}`,
          jobStatus: EnumJobStatus.Failure,
          otherJobsCombinedStatus: EnumJobStatus.InProgress,
        },
        {
          //expectation
          eventEmission: "FAILURE",
        },
      ],
      [
        {
          //input
          jobBuildId: `${buildId}-${EnumDomainName.Server}`,
          jobStatus: EnumJobStatus.Failure,
          otherJobsCombinedStatus: EnumJobStatus.Failure,
        },
        {
          //expectation
          eventEmission: "NONE",
        },
      ],
    ];

    for (const [input, expected] of testCases) {
      it(`When ${input.jobBuildId} returns ${input.jobStatus}, and the combined status is ${input.otherJobsCombinedStatus} it should emit ${expected.eventEmission} event and updated the cache accordingly`, async () => {
        // Arrange
        const codeGeneratorVersion = "v1.0.0";
        const errorMock = new Error("Test error");

        const kafkaFailureEventMock: CodeGenerationFailure.KafkaEvent = {
          key: null,
          value: <CodeGenerationFailure.Value>{
            buildId,
            error: errorMock,
            codeGeneratorVersion,
          },
        } as unknown as CodeGenerationFailure.KafkaEvent;

        const kafkaSuccessEventMock: CodeGenerationSuccess.KafkaEvent = {
          key: null,
          value: <CodeGenerationSuccess.Value>{
            buildId,
            codeGeneratorVersion,
          },
        };

        jest
          .spyOn(service, "getCodeGeneratorVersion")
          .mockResolvedValue(codeGeneratorVersion);

        jest.spyOn(service, "copyFromJobToArtifact").mockResolvedValue(true);
        jest
          .spyOn(codeGeneratorSplitterService, "setJobStatus")
          .mockResolvedValue(undefined);

        jest
          .spyOn(codeGeneratorSplitterService, "getJobStatus")
          .mockResolvedValue(input.jobStatus);

        jest
          .spyOn(codeGeneratorSplitterService, "extractBuildId")
          .mockReturnValue(buildId);

        jest
          .spyOn(codeGeneratorSplitterService, "getBuildStatus")
          .mockResolvedValue(input.otherJobsCombinedStatus);

        // Act
        await service.processBuildResult(
          resourceId,
          input.jobBuildId,
          input.jobStatus,
          input.jobStatus === EnumJobStatus.Failure ? errorMock : undefined
        );

        // Assert
        switch (expected.eventEmission) {
          case "NONE":
            expect(mockKafkaServiceEmitMessage).toBeCalledTimes(0);
            break;
          case "FAILURE":
            mockKafkaServiceEmitMessage.mockRejectedValueOnce(errorMock);
            expect(mockKafkaServiceEmitMessage).toHaveBeenCalledTimes(1);
            expect(mockKafkaServiceEmitMessage).toHaveBeenCalledWith(
              KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
              kafkaFailureEventMock
            );
            break;
          case "SUCCESS":
            mockKafkaServiceEmitMessage.mockResolvedValue(undefined);
            expect(mockKafkaServiceEmitMessage).toHaveBeenCalledTimes(1);
            expect(mockKafkaServiceEmitMessage).toHaveBeenCalledWith(
              KAFKA_TOPICS.CODE_GENERATION_SUCCESS_TOPIC,
              kafkaSuccessEventMock
            );
            break;
          default:
            break;
        }
      });
    }
  });
});
