import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types/models";
import { VersionService } from "./version.service";
import { PrismaService } from "../prisma/prisma.service";
import { AwsEcrService } from "../aws/aws-ecr.service";
import { AwsEcrModule } from "../aws/aws-ecr.module";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";

describe("VersionService", () => {
  let service: VersionService;
  const mockVersionFindUnique = jest.fn();
  const mockVersionFindMany = jest.fn();
  const mockVersionCreateMany = jest.fn();
  const mockAwsEcrServiceGetTags = jest
    .fn()
    .mockImplementation((token: string) => {
      return Promise.resolve([]);
    });

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
                default:
                  return "";
              }
            },
          },
        },
        {
          provide: PrismaService,
          useValue: {
            version: {
              findMany: mockVersionFindMany,
              findUnique: mockVersionFindUnique,
              createMany: mockVersionCreateMany,
              updateMany: jest.fn(),
            },
          },
        },
        {
          provide: AwsEcrService,
          useValue: {
            getTags: mockAwsEcrServiceGetTags,
          },
        },
        MockedAmplicationLoggerProvider,
        VersionService,
      ],
    }).compile();

    service = module.get<VersionService>(VersionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it.each([
    ["v1.0.1", CodeGeneratorVersionStrategy.Specific],
    ["v2.1.1", CodeGeneratorVersionStrategy.LatestMajor],
    ["v1.2.0", CodeGeneratorVersionStrategy.LatestMinor],
  ])(
    `should return version %s when %s is selected`,
    async (
      expected: string,
      codeGeneratorStrategy: CodeGeneratorVersionStrategy
    ) => {
      const selectedVersion = "v1.0.1";

      mockVersionFindUnique.mockImplementationOnce((args) => {
        if (args.where.id === selectedVersion) {
          return { name: selectedVersion };
        }
        return null;
      });
      mockVersionFindMany.mockResolvedValue([{ name: expected }]);

      const result = await service.getCodeGeneratorVersion({
        codeGeneratorVersion: selectedVersion,
        codeGeneratorStrategy,
      });

      expect(result).toEqual({ name: expected });
    }
  );

  it.each([
    [CodeGeneratorVersionStrategy.LatestMajor],
    [CodeGeneratorVersionStrategy.LatestMinor],
    [CodeGeneratorVersionStrategy.Specific],
  ])(
    "should return the dev version if setup when requesting a %s version",
    async (codeGeneratorStrategy) => {
      const devVersion = "next";
      const module: TestingModule = await Test.createTestingModule({
        imports: [AwsEcrModule],
        providers: [
          {
            provide: ConfigService,
            useValue: {
              get: (variable) => {
                switch (variable) {
                  case "DEV_VERSION_TAG":
                    return devVersion;
                  default:
                    return "";
                }
              },
            },
          },
          {
            provide: PrismaService,
            useValue: {
              version: {
                findMany: mockVersionFindMany,
              },
            },
          },
          MockedAmplicationLoggerProvider,
          VersionService,
        ],
      }).compile();

      service = module.get<VersionService>(VersionService);

      const result = await service.getCodeGeneratorVersion({
        codeGeneratorVersion: devVersion,
        codeGeneratorStrategy,
      });

      expect(result).toEqual({
        id: devVersion,
        name: devVersion,
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        changelog: `Latest development version from ${devVersion}`,
        deletedAt: null,
        isDeprecated: false,
      });
    }
  );

  describe("getCodeGeneratorAvailableVersions", () => {
    beforeEach(async () => {
      mockVersionFindMany.mockResolvedValue([
        { name: "v2.2.0" },
        { name: "v1.0.0" },
        { name: "v1.0.1" },
        { name: "v0.8.1" },
        { name: "v2.0.0" },
        { name: "v1.1.0" },
        { name: "v1.10.1" },
        { name: "v1.2.0" },
      ]);
    });

    it("should return all available versions", async () => {
      const versions = await service.findMany({});
      expect(versions).toEqual([
        { name: "v2.2.0" },
        { name: "v1.0.0" },
        { name: "v1.0.1" },
        { name: "v0.8.1" },
        { name: "v2.0.0" },
        { name: "v1.1.0" },
        { name: "v1.10.1" },
        { name: "v1.2.0" },
      ]);
    });

    it.each([["next"], ["master"]])(
      "should return %s version with all available versions when env variable DEV_VERSION_TAG=%s",
      async (devVersion: string) => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [AwsEcrModule],
          providers: [
            {
              provide: ConfigService,
              useValue: {
                get: (variable) => {
                  switch (variable) {
                    case "DEV_VERSION_TAG":
                      return devVersion;
                    default:
                      return "";
                  }
                },
              },
            },
            {
              provide: PrismaService,
              useValue: {
                version: {
                  findMany: mockVersionFindMany,
                },
              },
            },
            MockedAmplicationLoggerProvider,
            VersionService,
          ],
        }).compile();

        service = module.get<VersionService>(VersionService);

        const versions = await service.findMany({});
        expect(versions).toEqual([
          {
            id: devVersion,
            name: devVersion,
            isActive: true,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            changelog: `Latest development version from ${devVersion}`,
            deletedAt: null,
            isDeprecated: false,
          },
          { name: "v2.2.0" },
          { name: "v1.0.0" },
          { name: "v1.0.1" },
          { name: "v0.8.1" },
          { name: "v2.0.0" },
          { name: "v1.1.0" },
          { name: "v1.10.1" },
          { name: "v1.2.0" },
        ]);
      }
    );
  });

  describe("getLatestVersion", () => {
    it("should return the latest minor version for a selected version", async () => {
      const versions = [
        "v1.0.0",
        "v1.0.1",
        "v0.8.1",
        "v0.2.1",
        "v2.0.0",
        "v1.1.0",
        "v1.10.0",
        "v1.10.1",
        "v2.2.0",
        "v1.2.0",
      ];

      const selectedVersion = "v1.0.1";

      const selected = await service["getLatestMinorVersion"](
        versions,
        selectedVersion
      );

      expect(selected).toEqual("v1.10.1");
    });
    it("should return the latest version", async () => {
      const versions = [
        "v1.0.0",
        "v1.0.1",
        "v0.8.1",
        "v0.2.1",
        "v2.0.0",
        "v1.1.0",
        "v1.10.0",
        "v1.10.1",
        "v2.2.0",
        "v1.2.0",
      ];

      const selected = await service["getLatestVersion"](versions);

      expect(selected).toEqual("v2.2.0");
    });
  });

  describe("syncVersions", () => {
    it("should sync versions", async () => {
      const pushedDate = new Date();
      mockAwsEcrServiceGetTags.mockResolvedValue([
        {
          imageTags: ["v1.0.0"],
          imagePushedAt: pushedDate,
        },
        {
          imageTags: ["v1.0.1"],
          imagePushedAt: pushedDate,
        },
        {
          imageTags: ["v2.0.0"],
          imagePushedAt: pushedDate,
        },
      ]);
      mockVersionFindMany.mockResolvedValue([]);

      await service.syncVersions();

      expect(mockVersionFindMany).toBeCalledTimes(1);
      expect(mockVersionFindMany).toBeCalledWith({});
      expect(mockVersionCreateMany).toBeCalledTimes(1);
      expect(mockVersionCreateMany).toBeCalledWith({
        data: [
          {
            id: "v1.0.0",
            name: "v1.0.0",
            isActive: false,
            createdAt: pushedDate,
            updatedAt: expect.anything(),
            changelog: "",
            deletedAt: null,
            isDeprecated: false,
          },
          {
            id: "v1.0.1",
            name: "v1.0.1",
            isActive: false,
            createdAt: pushedDate,
            updatedAt: expect.anything(),
            changelog: "",
            deletedAt: null,
            isDeprecated: false,
          },
          {
            id: "v2.0.0",
            name: "v2.0.0",
            isActive: false,
            createdAt: pushedDate,
            updatedAt: expect.anything(),
            changelog: "",
            deletedAt: null,

            isDeprecated: false,
          },
        ],
      });
    });
  });
});
