import { ConfigService } from "@nestjs/config";
import { CodeGeneratorService } from "./code-generator-catalog.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Env } from "../env";
import axios from "axios";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types/models";

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
                  return "http://localhost:3000";
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
    async (expected: string, option: CodeGeneratorVersionStrategy) => {
      const selectedVersion = "v1.0.1";

      mockedAxios.get.mockImplementation(() =>
        Promise.resolve({
          data: ["v2.1.1", "v0.8.1", "v1.0.1", "v1.2.0"],
        })
      );

      const result = await service.getCodeGeneratorVersion({
        codeGeneratorVersion: selectedVersion,
        codeGeneratorVersionOption: option,
      });

      expect(result).toEqual(expected);
    }
  );

  describe("getCodeGeneratorAvailableVersions", () => {
    it("should return all available versions", async () => {
      mockedAxios.get.mockImplementation(() =>
        Promise.resolve({
          data: [
            "v1.0.0",
            "v1.0.1",
            "v0.8.1",
            "v2.0.0",
            "v1.1.0",
            "v1.10.1",
            "v2.2.0",
            "v1.2.0",
          ],
        })
      );

      const versions = await service["getCodeGeneratorAvailableVersions"]();
      expect(versions).toEqual([
        "v1.0.0",
        "v1.0.1",
        "v0.8.1",
        "v2.0.0",
        "v1.1.0",
        "v1.10.1",
        "v2.2.0",
        "v1.2.0",
      ]);
    });
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

      const selected = await service["getLatestVersion"](
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
