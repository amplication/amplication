import { join, dirname } from "node:path";
import { MakeDirectoryOptions, promises } from "node:fs";

import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import fsExtra from "fs-extra";

import { AppInfo, DSGResourceData } from "@amplication/code-gen-types";

import { BuildRunnerService } from "./build-runner.service";
import { Env } from "../env";
import { BuildJobsHandlerService } from "../build-job-handler/build-job-handler.service";
import { EnumDomainName, EnumJobStatus } from "../types";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import {
  CodeGenerationFailure,
  KAFKA_TOPICS,
  PackageManagerCreateRequest,
} from "@amplication/schema-registry";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types";
import axios from "axios";
import { BuildLoggerService } from "../build-logger/build-logger.service";
import { NotifyPluginVersionDto } from "./dto/NotifyPluginVersion";

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

const EXAMPLE_DSG_RESOURCE_DATA: DSGResourceData = {
  resourceType: "Service",
  buildId: "",
  pluginInstallations: [],
  packages: [],
};

const extractDsgResourceDataMock = jest.fn(() => {
  return EXAMPLE_DSG_RESOURCE_DATA;
});

const buildJobsHandlerServiceExtractBuildIdMock = jest.fn(() => {
  return "buildId";
});

describe("BuildRunnerService", () => {
  let service: BuildRunnerService;
  let configService: ConfigService;
  let buildJobsHandlerService: BuildJobsHandlerService;
  let codeGeneratorService: CodeGeneratorService;
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
            getOrThrow: (variable) => {
              switch (variable) {
                case Env.FEATURE_SPLIT_JOBS_MIN_DSG_VERSION:
                  return "v2.1.1";
                default:
                  return "";
              }
            },
          },
        },
        {
          provide: BuildJobsHandlerService,
          useValue: {
            extractBuildId: buildJobsHandlerServiceExtractBuildIdMock,
            splitBuildsIntoJobs: jest.fn(),
            getBuildStatus: jest.fn(),
            getJobStatus: jest.fn(),
            setJobStatus: jest.fn(),
            extractDsgResourceData: extractDsgResourceDataMock,
          },
        },
        {
          provide: CodeGeneratorService,
          useValue: {
            getCodeGeneratorVersion: jest.fn(),
            compareVersions: jest.fn(),
          },
        },
        {
          provide: BuildLoggerService,
          useValue: {
            addCodeGenerationLog: jest.fn(),
          },
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
    buildJobsHandlerService = module.get<BuildJobsHandlerService>(
      BuildJobsHandlerService
    );
    codeGeneratorService =
      module.get<CodeGeneratorService>(CodeGeneratorService);
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
    it("should copy file and/or directories from `jobPath` to `artifactPath`", async () => {
      const resourceId = "resourceId";
      const buildId = "buildId";

      const spyOnBuildJobsHandlerServiceExtractBuildId = jest
        .spyOn(buildJobsHandlerService, "extractBuildId")
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

      await service.copyFromJobToArtifact(resourceId, buildId);

      expect(spyOnBuildJobsHandlerServiceExtractBuildId).toBeCalledTimes(1);
      expect(spyOnFsExtraCopy).toBeCalledWith(jobPath, artifactPath);
      await expect(fsExtra.copy(jobPath, artifactPath)).resolves.not.toThrow();
    });

    it("should throw an error when copy files failed", async () => {
      const buildId = "buildId";
      const mockedError = new Error("Copy files failed");

      jest
        .spyOn(buildJobsHandlerService, "extractBuildId")
        .mockReturnValue(buildId);

      spyOnFsExtraCopy.mockImplementationOnce(() => {
        throw mockedError;
      });

      await expect(
        service.copyFromJobToArtifact("resource-id", "job-build-id")
      ).rejects.toThrow(mockedError.message);
    });
  });

  describe("runBuild", () => {
    it("should split the build into jobs when code generator version has support for the new split job functionality", async () => {
      // Arrange
      const resourceId = "resourceId";
      const buildId = "buildId";
      const expectedCodeGeneratorVersion = "v2.1.1";
      const dsgResourceDataMock: DSGResourceData = {
        resourceType: "Service",
        buildId: buildId,
        pluginInstallations: [],
        resourceInfo: {
          settings: {
            serverSettings: {
              generateServer: true,
            },
            adminUISettings: {
              generateAdminUI: true,
            },
          },
          codeGeneratorVersionOptions: {
            version: expectedCodeGeneratorVersion,
            selectionStrategy: CodeGeneratorVersionStrategy.Specific,
          },
        } as unknown as AppInfo,
      };

      jest
        .spyOn(codeGeneratorService, "getCodeGeneratorVersion")
        .mockResolvedValue(expectedCodeGeneratorVersion);

      jest.spyOn(codeGeneratorService, "compareVersions").mockReturnValue(1);

      jest
        .spyOn(buildJobsHandlerService, "splitBuildsIntoJobs")
        .mockResolvedValue([
          [
            `${buildId}-${EnumDomainName.Server}`,
            {
              ...dsgResourceDataMock,
              resourceInfo: {
                ...dsgResourceDataMock.resourceInfo,
                settings: {
                  ...dsgResourceDataMock.resourceInfo.settings,
                  adminUISettings: {
                    ...dsgResourceDataMock.resourceInfo.settings
                      .adminUISettings,
                    generateAdminUI: false,
                  },
                },
              },
            } as DSGResourceData,
          ],
          [
            `${buildId}-${EnumDomainName.AdminUI}`,
            {
              ...dsgResourceDataMock,
              resourceInfo: {
                ...dsgResourceDataMock.resourceInfo,
                settings: {
                  ...dsgResourceDataMock.resourceInfo.settings,
                  serverSettings: {
                    ...dsgResourceDataMock.resourceInfo.settings.serverSettings,
                    generateServer: false,
                  },
                },
              },
            } as DSGResourceData,
          ],
        ]);

      const spyOnSaveDsgResourceData = jest
        .spyOn(service, "saveDsgResourceData")
        .mockResolvedValue(undefined);

      const spyOnAxiosPost = jest.spyOn(axios, "post").mockResolvedValue({
        data: {
          message: "Success",
        },
      });

      // Act
      await service.runBuild(resourceId, buildId, dsgResourceDataMock);

      // Assert
      expect(spyOnSaveDsgResourceData).toBeCalledTimes(2);
      expect(spyOnAxiosPost).toBeCalledTimes(2);
      expect(spyOnAxiosPost).toHaveBeenNthCalledWith(1, "http://runner.url/", {
        resourceId: resourceId,
        buildId: `${buildId}-${EnumDomainName.Server}`,
        codeGeneratorName: "data-service-generator",
        codeGeneratorVersion: expectedCodeGeneratorVersion,
      });
      expect(spyOnAxiosPost).toHaveBeenNthCalledWith(2, "http://runner.url/", {
        resourceId: resourceId,
        buildId: `${buildId}-${EnumDomainName.AdminUI}`,
        codeGeneratorName: "data-service-generator",
        codeGeneratorVersion: expectedCodeGeneratorVersion,
      });
    });

    it("On code generation request, it should split the build into jobs, save the DSG resource data and send it to the runner with the default dsg-image-name", async () => {
      // Arrange
      const resourceId = "resourceId";
      const buildId = "buildId";
      const expectedCodeGeneratorVersion = "v2.1.1";
      const dsgResourceDataMock: DSGResourceData = {
        resourceType: "Service",
        buildId: buildId,
        pluginInstallations: [],
        resourceInfo: {
          settings: {
            serverSettings: {
              generateServer: true,
            },
            adminUISettings: {
              generateAdminUI: true,
            },
          },
          codeGeneratorVersionOptions: {
            version: expectedCodeGeneratorVersion,
            selectionStrategy: CodeGeneratorVersionStrategy.Specific,
          },
        } as unknown as AppInfo,
      };

      jest
        .spyOn(codeGeneratorService, "getCodeGeneratorVersion")
        .mockResolvedValue(expectedCodeGeneratorVersion);

      jest.spyOn(codeGeneratorService, "compareVersions").mockReturnValue(1);

      jest
        .spyOn(buildJobsHandlerService, "splitBuildsIntoJobs")
        .mockResolvedValue([
          [
            `${buildId}-${EnumDomainName.Server}`,
            {
              ...dsgResourceDataMock,
              resourceInfo: {
                ...dsgResourceDataMock.resourceInfo,
                settings: {
                  ...dsgResourceDataMock.resourceInfo.settings,
                  adminUISettings: {
                    ...dsgResourceDataMock.resourceInfo.settings
                      .adminUISettings,
                    generateAdminUI: false,
                  },
                },
              },
            } as DSGResourceData,
          ],
          [
            `${buildId}-${EnumDomainName.AdminUI}`,
            {
              ...dsgResourceDataMock,
              resourceInfo: {
                ...dsgResourceDataMock.resourceInfo,
                settings: {
                  ...dsgResourceDataMock.resourceInfo.settings,
                  serverSettings: {
                    ...dsgResourceDataMock.resourceInfo.settings.serverSettings,
                    generateServer: false,
                  },
                },
              },
            } as DSGResourceData,
          ],
        ]);

      const spyOnSaveDsgResourceData = jest
        .spyOn(service, "saveDsgResourceData")
        .mockResolvedValue(undefined);

      const spyOnAxiosPost = jest.spyOn(axios, "post").mockResolvedValue({
        data: {
          message: "Success",
        },
      });

      // Act
      await service.runBuild(resourceId, buildId, dsgResourceDataMock);

      // Assert
      expect(spyOnSaveDsgResourceData).toBeCalledTimes(2);
      expect(spyOnAxiosPost).toBeCalledTimes(2);
      expect(spyOnAxiosPost).toHaveBeenNthCalledWith(1, "http://runner.url/", {
        resourceId: resourceId,
        buildId: `${buildId}-${EnumDomainName.Server}`,
        codeGeneratorName: "data-service-generator",
        codeGeneratorVersion: expectedCodeGeneratorVersion,
      });
      expect(spyOnAxiosPost).toHaveBeenNthCalledWith(2, "http://runner.url/", {
        resourceId: resourceId,
        buildId: `${buildId}-${EnumDomainName.AdminUI}`,
        codeGeneratorName: "data-service-generator",
        codeGeneratorVersion: expectedCodeGeneratorVersion,
      });
    });

    it("On code generation request with exception, should emit Kafka failure event", async () => {
      // Arrange
      const errorMock = new Error("Test error");
      const resourceId = "resourceId";
      const buildId = "buildId";
      const expectedCodeGeneratorVersion = "v1.0.0";
      const dsgResourceDataMock: DSGResourceData = {
        resourceType: "Service",
        buildId: buildId,
        pluginInstallations: [],
        resourceInfo: {
          settings: {
            serverSettings: {
              generateServer: true,
            },
            adminUISettings: {
              generateAdminUI: true,
            },
          },
          codeGeneratorVersionOptions: {
            version: expectedCodeGeneratorVersion,
            selectionStrategy: CodeGeneratorVersionStrategy.Specific,
          },
        } as unknown as AppInfo,
      };

      jest
        .spyOn(codeGeneratorService, "getCodeGeneratorVersion")
        .mockResolvedValue(expectedCodeGeneratorVersion);

      jest.spyOn(codeGeneratorService, "compareVersions").mockReturnValue(1);

      jest
        .spyOn(buildJobsHandlerService, "splitBuildsIntoJobs")
        .mockResolvedValue([
          [
            `${buildId}-${EnumDomainName.Server}`,
            {
              ...dsgResourceDataMock,
              resourceInfo: {
                ...dsgResourceDataMock.resourceInfo,
                settings: {
                  ...dsgResourceDataMock.resourceInfo.settings,
                  adminUISettings: {
                    ...dsgResourceDataMock.resourceInfo.settings
                      .adminUISettings,
                    generateAdminUI: false,
                  },
                },
              },
            } as DSGResourceData,
          ],
          [
            `${buildId}-${EnumDomainName.AdminUI}`,
            {
              ...dsgResourceDataMock,
              resourceInfo: {
                ...dsgResourceDataMock.resourceInfo,
                settings: {
                  ...dsgResourceDataMock.resourceInfo.settings,
                  serverSettings: {
                    ...dsgResourceDataMock.resourceInfo.settings.serverSettings,
                    generateServer: false,
                  },
                },
              },
            } as DSGResourceData,
          ],
        ]);

      jest.spyOn(service, "runJob").mockRejectedValue(errorMock);

      const expectedKafkaFailureEvent: CodeGenerationFailure.KafkaEvent = {
        key: null,
        value: <CodeGenerationFailure.Value>{
          buildId,
          errorMessage: errorMock.message,
        },
      } as unknown as CodeGenerationFailure.KafkaEvent;

      // Act
      await service.runBuild(resourceId, buildId, dsgResourceDataMock);

      // Assert
      expect(mockKafkaServiceEmitMessage).toHaveBeenNthCalledWith(
        1,
        KAFKA_TOPICS.CODE_GENERATION_NOTIFY_VERSION_TOPIC,
        {
          key: null,
          value: {
            buildId,
            codeGeneratorVersion: expectedCodeGeneratorVersion,
          },
        }
      );
      expect(mockKafkaServiceEmitMessage).toHaveBeenNthCalledWith(
        2,
        KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
        expectedKafkaFailureEvent
      );
    });
  });

  it("emitCodeGenerationFailureWhenJobStatusFailed should not emit Kafka failure event when build already failed", async () => {
    // Arrange
    const buildId = "buildId";

    const spyOnSetJobStatus = jest.spyOn(
      buildJobsHandlerService,
      "setJobStatus"
    );

    spyOnSetJobStatus.mockResolvedValue(undefined);
    jest
      .spyOn(buildJobsHandlerService, "extractBuildId")
      .mockReturnValue(buildId);

    jest
      .spyOn(buildJobsHandlerService, "getBuildStatus")
      .mockResolvedValue(EnumJobStatus.Failure);

    // Act
    await service.emitCodeGenerationFailureWhenJobStatusFailed(buildId);

    // Assert
    expect(mockKafkaServiceEmitMessage).not.toBeCalled();
    expect(spyOnSetJobStatus).toBeCalledWith(buildId, EnumJobStatus.Failure);
  });

  it("onCodeGenerationSuccess - emit code-generation.success topic when all job builds completed and there are no packages", async () => {
    // Arrange
    const buildId = "buildId";
    const resourceId = "resourceId";

    const spyOnSetJobStatus = jest.spyOn(
      buildJobsHandlerService,
      "setJobStatus"
    );

    spyOnSetJobStatus.mockResolvedValue(undefined);
    jest
      .spyOn(buildJobsHandlerService, "extractBuildId")
      .mockReturnValue(buildId);

    jest
      .spyOn(buildJobsHandlerService, "getBuildStatus")
      .mockResolvedValue(EnumJobStatus.Success);

    // Act
    await service.onCodeGenerationSuccess({
      buildId: buildId,
      resourceId: resourceId,
    });

    // Assert
    expect(mockKafkaServiceEmitMessage).toBeCalledTimes(1);
    expect(mockKafkaServiceEmitMessage).toBeCalledWith(
      KAFKA_TOPICS.CODE_GENERATION_SUCCESS_TOPIC,
      {
        key: null,
        value: {
          buildId,
        },
      }
    );
  });

  it("onCodeGenerationSuccess - do not emit event when some jobs are still in progress ", async () => {
    // Arrange
    const buildId = "buildId";
    const resourceId = "resourceId";

    const spyOnSetJobStatus = jest.spyOn(
      buildJobsHandlerService,
      "setJobStatus"
    );

    spyOnSetJobStatus.mockResolvedValue(undefined);
    jest
      .spyOn(buildJobsHandlerService, "extractBuildId")
      .mockReturnValue(buildId);

    jest
      .spyOn(buildJobsHandlerService, "getBuildStatus")
      .mockResolvedValue(EnumJobStatus.InProgress);

    // Act
    await service.onCodeGenerationSuccess({
      buildId: buildId,
      resourceId: resourceId,
    });

    // Assert
    expect(mockKafkaServiceEmitMessage).toBeCalledTimes(0);
  });

  it("onCodeGenerationSuccess - emit package-manager-create topic when all job builds completed, and we have packages ", async () => {
    // Arrange
    const buildId = "buildId";
    const resourceId = "resourceId";

    const spyOnSetJobStatus = jest.spyOn(
      buildJobsHandlerService,
      "setJobStatus"
    );

    Object.defineProperty(service, "enablePackageManager", {
      get: jest.fn(() => true),
    });

    spyOnSetJobStatus.mockResolvedValue(undefined);
    jest
      .spyOn(buildJobsHandlerService, "extractBuildId")
      .mockReturnValue(buildId);

    jest
      .spyOn(buildJobsHandlerService, "getBuildStatus")
      .mockResolvedValue(EnumJobStatus.Success);

    const dsgResourceData = {
      ...EXAMPLE_DSG_RESOURCE_DATA,
      packages: [
        {
          id: "package-id",
          displayName: "package-name",
          summary: "package-summary",
        },
      ],
    };

    extractDsgResourceDataMock.mockReturnValue(dsgResourceData);

    // Act
    await service.onCodeGenerationSuccess({
      buildId: buildId,
      resourceId: resourceId,
    });

    const requestPackagesEvent: PackageManagerCreateRequest.KafkaEvent = {
      key: null,
      value: { resourceId: resourceId, buildId: buildId, dsgResourceData },
    };

    // Assert
    expect(mockKafkaServiceEmitMessage).toBeCalledTimes(1);
    expect(mockKafkaServiceEmitMessage).toBeCalledWith(
      KAFKA_TOPICS.PACKAGE_MANAGER_CREATE_REQUEST,
      requestPackagesEvent
    );
  });

  it("should emit plugin notify event", async () => {
    const BUILD_ID = "buildId";
    buildJobsHandlerServiceExtractBuildIdMock.mockReturnValueOnce(BUILD_ID);

    const pluginVersion: NotifyPluginVersionDto = {
      requestedFullPackageName: "plugin@latest",
      packageName: "plugin",
      packageVersion: "1.0.1",
      buildId: "buildId-server",
    };

    // Act
    await service.emitBuildPluginNotifyVersion(pluginVersion);

    // Assert
    expect(buildJobsHandlerServiceExtractBuildIdMock).toHaveBeenCalledTimes(1);
    expect(mockKafkaServiceEmitMessage).toHaveBeenCalledTimes(1);
    expect(mockKafkaServiceEmitMessage).toHaveBeenCalledWith(
      KAFKA_TOPICS.BUILD_PLUGIN_NOTIFY_VERSION_TOPIC,
      {
        key: null,
        value: { ...pluginVersion, buildId: BUILD_ID },
      }
    );
  });
});
