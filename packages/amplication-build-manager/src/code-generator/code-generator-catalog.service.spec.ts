import { ConfigService } from "@nestjs/config";
import { CodeGeneratorService } from "./code-generator-catalog.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Env } from "../env";
import axios from "axios";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types";
import { Generator } from "./generator.interface";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("CodeGeneratorService", () => {
  let service: CodeGeneratorService;

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
                case Env.DSG_CATALOG_SERVICE_URL:
                  return "http://localhost:3000/";
                default:
                  return "";
              }
            },
          },
        },
        CodeGeneratorService,
      ],
    }).compile();

    service = module.get<CodeGeneratorService>(CodeGeneratorService);
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

      mockedAxios.post.mockImplementation((url) => {
        if (
          url === "http://localhost:3000/api/versions/code-generator-version"
        ) {
          return Promise.resolve({
            data: {
              name: expected,
            },
          });
        }
      });

      const result = await service.getCodeGeneratorVersion({
        codeGeneratorFullName: "data-service-generator",
        codeGeneratorVersion: selectedVersion,
        codeGeneratorStrategy,
      });

      expect(result).toEqual(expected);
    }
  );

  it.each([
    ["data-service-generator", "NodeJS"],
    ["generator-dotnet-webapi", "DotNET"],
  ])(
    `should return the full name %s when %s is selected`,
    async (expectedFullName: string, codeGeneratorName: string) => {
      const mockGenerators: Generator[] = [
        {
          fullName: "generator-dotnet-webapi",
          isActive: true,
          name: "DotNET",
          version: [],
        },
        {
          fullName: "data-service-generator",
          isActive: true,
          name: "NodeJS",
          version: [],
        },
      ];

      mockedAxios.get.mockResolvedValue({ data: mockGenerators });

      const result = await service.getCodeGenerators(codeGeneratorName);

      expect(result).toEqual(expectedFullName);
    }
  );

  describe("compareVersions", () => {
    it("should return a positive number when currentVersion is greater", () => {
      expect(service.compareVersions("v2.1.1", "v2.1.0")).toBeGreaterThan(0);
    });

    it("should return a negative number when currentVersion is lesser", () => {
      expect(service.compareVersions("v2.1.0", "v2.2.0")).toBeLessThan(0);
    });

    it("should return 0 when both versions are equal", () => {
      expect(service.compareVersions("v2.1.1", "v2.1.1")).toBe(0);
    });

    it('should return 1 for a non-semver currentVersion like "next"', () => {
      expect(service.compareVersions("next", "v2.1.0")).toBe(1);
    });

    it("should throw an error for an invalid version string", () => {
      const invalidVersion = "invalid-version";
      expect(() => {
        service.compareVersions("v2.1.0", invalidVersion);
      }).toThrow(new Error(`Invalid version: ${invalidVersion}`));
    });

    it("should throw an error if currentVersion has pre-release tags", () => {
      expect(() => {
        service.compareVersions("v2.1.0-alpha", "v2.1.0");
      }).toThrow(/prerelease tags are not supported/i);
    });
  });
});
