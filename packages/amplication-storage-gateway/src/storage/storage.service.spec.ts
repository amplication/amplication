import { join } from "node:path";
import fs, { promises } from "node:fs";
import { Buffer } from "node:buffer";

import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import glob from "glob";

import { StorageService } from "./storage.service";
import { BUILD_ARTIFACTS_BASE_FOLDER } from "../constants";
import { FileMeta } from "./dto/FileMeta";
import { NodeTypeEnum } from "./dto/NodeTypeEnum";

const spyOnGlobSync = jest.spyOn(glob, "sync");
const spyOnReadFileSync = jest.spyOn(fs, "readFileSync");
const spyOnUtimes = jest.spyOn(promises, "utimes");
const sortFoldersAndFiles = jest.spyOn(
  StorageService as any,
  "sortFoldersAndFiles"
);

const FIXED_SYSTEM_TIME = "2023-06-22T00:00:00Z";
const RESOURCE_ID = "resourceId";
const BUILD_ID = "buildId";
const RELATIVE_PATH = "relativePath";

spyOnGlobSync.mockImplementation((pattern, options) => {
  if (options.nodir) {
    return ["fileOne", "fileTwo", "fileThree"];
  }
  return ["firstLevelDir", "firstLevelDir/secondLevelDir"];
});

describe("StorageService", () => {
  let service: StorageService;
  let configService: ConfigService;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case BUILD_ARTIFACTS_BASE_FOLDER:
                  return "test/dir";
                default:
                  return "";
              }
            },
          },
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should sort files and folders with folders first and then files sorted alphabetically", () => {
    const cwd = join(
      configService.get(BUILD_ARTIFACTS_BASE_FOLDER),
      RESOURCE_ID,
      BUILD_ID,
      RELATIVE_PATH
    );
    const spyOnGetBuildFilesList = jest.spyOn(
      StorageService.prototype,
      "getBuildFilesList"
    );
    const filesMap: Record<string, FileMeta> = {
      fileOne: {
        type: NodeTypeEnum.File,
        name: "fileOne",
        path: join(RELATIVE_PATH, "fileOne"),
      },
      fileTwo: {
        type: NodeTypeEnum.File,
        name: "fileTwo",
        path: join(RELATIVE_PATH, "fileTwo"),
      },
      fileThree: {
        type: NodeTypeEnum.File,
        name: "fileThree",
        path: join(RELATIVE_PATH, "fileThree"),
      },
      firstLevelDir: {
        type: NodeTypeEnum.Folder,
        name: "firstLevelDir",
        path: join(RELATIVE_PATH, "firstLevelDir"),
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "firstLevelDir/secondLevelDir": {
        type: NodeTypeEnum.Folder,
        name: "firstLevelDir/secondLevelDir",
        path: join(RELATIVE_PATH, "firstLevelDir/secondLevelDir"),
      },
    };

    const orderedFiles = Object.values(filesMap)
      .filter(({ type }) => type === NodeTypeEnum.File)
      .sort((a, b) => a.name.localeCompare(b.name));

    const orderedFoldersWithFiles = Object.values(filesMap)
      .filter(({ type }) => type === NodeTypeEnum.Folder)
      .sort((a, b) => a.name.localeCompare(b.name));

    service.getBuildFilesList(RESOURCE_ID, BUILD_ID, RELATIVE_PATH);

    expect(spyOnGetBuildFilesList).toBeCalledWith(
      RESOURCE_ID,
      BUILD_ID,
      RELATIVE_PATH
    );
    expect(spyOnGlobSync).toBeCalledTimes(2);
    expect(spyOnGlobSync).toHaveBeenNthCalledWith(
      1,
      `*`,
      expect.objectContaining({
        nodir: true,
        dot: true,
        cwd,
      })
    );
    expect(spyOnGlobSync).toHaveBeenNthCalledWith(
      2,
      `*`,
      expect.objectContaining({
        nodir: false,
        cwd,
      })
    );
    expect(sortFoldersAndFiles).toBeCalledWith(filesMap);
    expect(sortFoldersAndFiles).toReturnWith(
      expect.arrayContaining([...orderedFiles, ...orderedFoldersWithFiles])
    );
  });

  it("should read file content synchronously, if file exists", () => {
    const cwd = join(
      configService.get(BUILD_ARTIFACTS_BASE_FOLDER),
      RESOURCE_ID,
      BUILD_ID,
      RELATIVE_PATH
    );
    spyOnReadFileSync.mockImplementation(() =>
      Buffer.from("hello amplication")
    );

    service.fileContent(RESOURCE_ID, BUILD_ID, RELATIVE_PATH);

    expect(spyOnReadFileSync).toBeCalledTimes(1);
    expect(spyOnReadFileSync).toBeCalledWith(cwd);
    expect(spyOnReadFileSync).toHaveReturnedWith(
      Buffer.from("hello amplication")
    );
  });

  it("change the file system timestamps of the file named `file.txt`", async () => {
    const filename = "file.txt";
    const time = new Date();
    const fp = join(configService.get(BUILD_ARTIFACTS_BASE_FOLDER), filename);

    await expect(service.touch()).resolves.not.toThrow();
    expect(spyOnUtimes).toBeCalledWith(fp, time, time);
  });
});
