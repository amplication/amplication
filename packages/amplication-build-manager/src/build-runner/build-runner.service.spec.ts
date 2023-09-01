import { join, dirname } from "node:path";
import { MakeDirectoryOptions, promises } from "node:fs";

import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import fsExtra from "fs-extra";

import { DSGResourceData } from "@amplication/code-gen-types";

import { BuildRunnerService } from "./build-runner.service";
import { Env } from "../env";

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

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
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
        BuildRunnerService,
      ],
    }).compile();

    service = module.get<BuildRunnerService>(BuildRunnerService);
    configService = module.get<ConfigService>(ConfigService);
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

    expect(spyOnFsExtraCopy).toBeCalledWith(jobPath, artifactPath);
    await expect(fsExtra.copy(jobPath, artifactPath)).resolves.not.toThrow();
  });
});
