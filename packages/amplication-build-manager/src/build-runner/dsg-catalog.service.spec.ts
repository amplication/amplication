import { ConfigService } from "@nestjs/config";
import { DsgCatalogService } from "./dsg-catalog.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Env } from "../env";
import axios from "axios";
import { DsgVersionOption } from "@amplication/schema-registry";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("DsgCatalogService", () => {
  let service: DsgCatalogService;

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
        DsgCatalogService,
      ],
    }).compile();

    service = module.get<DsgCatalogService>(DsgCatalogService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it.each([
    ["v1.0.1", DsgVersionOption.SPECIFIC],
    ["v2.1.1", DsgVersionOption.LATEST],
    ["v1.2.0", DsgVersionOption.LATEST_MINOR],
  ])(
    `should return version %s when %s is selected`,
    async (expected: string, option: DsgVersionOption) => {
      const selectedVersion = "v1.0.1";

      mockedAxios.get.mockImplementation(() =>
        Promise.resolve({
          data: ["v2.1.1", "v0.8.1", "v1.0.1", "v1.2.0"],
        })
      );

      const result = await service.getDsgVersion({
        dsgVersion: selectedVersion,
        dsgVersionOption: option,
      });

      expect(result).toEqual(expected);
    }
  );

  describe("getDsgAvailableVersions", () => {
    it("should return all available versions sorted desc", async () => {
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

      const versions = await service["getDsgAvailableVersions"]();
      expect(versions).toEqual([
        "v2.2.0",
        "v2.0.0",
        "v1.10.1",
        "v1.2.0",
        "v1.1.0",
        "v1.0.1",
        "v1.0.0",
        "v0.8.1",
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
