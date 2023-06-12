import { Test } from "@nestjs/testing";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { PluginVersionService } from "./pluginVersion.service";
import { PrismaService } from "../prisma/prisma.service";

const moduleMocker = new ModuleMocker(global);

describe("Service: PluginVersionService", () => {
  let service: PluginVersionService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [PluginVersionService],
    })
      .useMocker((token) => {
        const results = [
          {
            id: "pluginVersionId1",
            version: "1.0.0",
            pluginId: "pluginVersionPluginId",
            pluginIdVersion: "pluginVersionPluginIdVersion-1.0.0",
            isLatest: true,
            deprecated: null,
            settings: {},
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "pluginVersionId2",
            version: "2.0.0",
            pluginId: "pluginVersionPluginId",
            pluginIdVersion: "pluginVersionPluginIdVersion-2.0.0",
            isLatest: false,
            deprecated: null,
            settings: {},
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        if (token === PrismaService) {
          return {
            pluginVersion: {
              findMany: jest.fn().mockResolvedValue(results),
            },
          };
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>;
          const mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new mock();
        }
      })
      .compile();

    service = moduleRef.get(PluginVersionService);
  });

  it("findMany should return all the plugin versions plus a 'latest' version for the version tagged as latest", async () => {
    const result = await service.findMany({});

    expect(result).toStrictEqual([
      {
        id: "latest",
        version: "latest",
        pluginId: "pluginVersionPluginId",
        pluginIdVersion: "pluginVersionPluginIdVersion-1.0.0",
        isLatest: true,
        deprecated: null,
        settings: {},
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: "pluginVersionId1",
        version: "1.0.0",
        pluginId: "pluginVersionPluginId",
        pluginIdVersion: "pluginVersionPluginIdVersion-1.0.0",
        isLatest: true,
        deprecated: null,
        settings: {},
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: "pluginVersionId2",
        version: "2.0.0",
        pluginId: "pluginVersionPluginId",
        pluginIdVersion: "pluginVersionPluginIdVersion-2.0.0",
        isLatest: false,
        deprecated: null,
        settings: {},
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ]);
  });
});
