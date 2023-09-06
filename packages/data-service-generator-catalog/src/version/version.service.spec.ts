import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types/models";
import { VersionService } from "./version.service";
import { PrismaService } from "../prisma/prisma.service";

describe("VersionService", () => {
  let service: VersionService;
  const mockVersionFindMany = jest.fn();

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
            },
          },
        },
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

      mockVersionFindMany.mockResolvedValue([{ name: expected }]);

      const result = await service.getCodeGeneratorVersion({
        codeGeneratorVersion: selectedVersion,
        codeGeneratorStrategy,
      });

      expect(result).toEqual({ name: expected });
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
          imports: [],
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
});
