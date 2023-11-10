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
import { KAFKA_TOPICS } from "@amplication/schema-registry";

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
            getBuildStatus: jest.fn(),
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

  it("should copy file and/or directories from `jobPath` to `artifactPath`", async () => {
    const resourceId = "resourceId";
    const buildId = "buildId";

    const spyOnCodeGeneratorSplitterServiceExtractBuildId = jest
      .spyOn(codeGeneratorSplitterService, "extractBuildId")
      .mockReturnValue(buildId);

    await service.copyFromJobToArtifact(resourceId, buildId);

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

    expect(spyOnCodeGeneratorSplitterServiceExtractBuildId).toBeCalledTimes(1);
    expect(spyOnFsExtraCopy).toBeCalledWith(jobPath, artifactPath);
    await expect(fsExtra.copy(jobPath, artifactPath)).resolves.not.toThrow();
  });

  it("should call emitCodeGenerationFailureWhenJobStatusSetAsFailed on failure", async () => {
    const resourceId = "some-resource-id";
    const jobBuildId = "some-build-id";
    const error = new Error("Sample error");

    const spyOnEmitCodeGenerationFailureWhenJobStatusSetAsFailed = jest.spyOn(
      service,
      "emitCodeGenerationFailureWhenJobStatusSetAsFailed"
    );

    await service.processBuildResult(
      resourceId,
      jobBuildId,
      EnumJobStatus.Failure,
      error
    );

    expect(
      spyOnEmitCodeGenerationFailureWhenJobStatusSetAsFailed
    ).toHaveBeenCalledWith(jobBuildId, error);
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
      it(`When ${input.jobBuildId} returns ${input.jobStatus}, it should emit ${expected.eventEmission} event and updated the cache accordingly`, async () => {
        // Arrange

        // spyon copyFromJobToArtifact
        jest.spyOn(service, "copyFromJobToArtifact").mockResolvedValue(true);
        // spyon setJobStatus
        jest.spyOn(codeGeneratorSplitterService, "setJobStatus");
        // spy on extractBuildId
        jest.spyOn(codeGeneratorSplitterService, "extractBuildId");
        // spyon getBuildStatus
        jest
          .spyOn(codeGeneratorSplitterService, "getBuildStatus")
          .mockResolvedValue(input.otherJobsCombinedStatus);
        // spyon emitCodeGenerationSuccessEvent
        jest
          .spyOn(service, "emitCodeGenerationSuccessEvent")
          .mockResolvedValue(undefined);
        // spyon emitCodeGenerationFailureEvent
        jest
          .spyOn(service, "emitCodeGenerationFailureEvent")
          .mockResolvedValue(undefined);

        // Act
        await service.processBuildResult(
          resourceId,
          input.jobBuildId,
          input.jobStatus
        );

        // Assert

        switch (expected.eventEmission) {
          case "NONE":
            expect(mockKafkaServiceEmitMessage).toBeCalledTimes(0);
            break;
          case "FAILURE":
            expect(mockKafkaServiceEmitMessage).toHaveBeenCalledTimes(1);
            expect(mockKafkaServiceEmitMessage).toHaveBeenCalledWith(
              KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
              expect.any(Object)
            );
            break;
          case "SUCCESS":
            expect(mockKafkaServiceEmitMessage).toHaveBeenCalledTimes(1);
            expect(mockKafkaServiceEmitMessage).toHaveBeenCalledWith(
              KAFKA_TOPICS.CODE_GENERATION_SUCCESS_TOPIC,
              expect.any(Object)
            );
            break;
          default:
            break;
        }
      });
    }
  });
});
