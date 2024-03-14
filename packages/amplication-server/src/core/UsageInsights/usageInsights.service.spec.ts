import { Test, TestingModule } from "@nestjs/testing";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { UsageInsightsService } from "./usageInsights.service";
import { PrismaService } from "../../prisma";
import { QueryRawResult } from "./types";

const buildAggregateMock = jest.fn();
const prismaQueryRawMock = jest.fn();

describe("UsageInsightsService", () => {
  let service: UsageInsightsService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsageInsightsService,
        MockedAmplicationLoggerProvider,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: prismaQueryRawMock,
            build: {
              aggregate: buildAggregateMock,
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsageInsightsService>(UsageInsightsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("countLinesOfCodeAddedOrUpdatedForBuild", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    const now = new Date();

    it("should count the lines of code added/updated for a given project", async () => {
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      buildAggregateMock.mockResolvedValueOnce({
        _sum: {
          linesOfCode: 10,
        },
      });
      const result = await service.countLinesOfCode({
        workspaceId: "workspace-id",
        projectId: "project-id",
        startDate,
        endDate,
      });

      expect(buildAggregateMock).toBeCalledWith({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          linesOfCode: {
            not: null,
          },
          resource: {
            project: {
              workspaceId: "workspace-id",
              id: "project-id",
            },
          },
        },
        _sum: {
          linesOfCode: true,
        },
      });

      expect(result).toBeDefined();
    });

    it("should count the lines of code added/updated for all projects", async () => {
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 14
      );
      const endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      buildAggregateMock.mockResolvedValueOnce({
        _sum: {
          linesOfCode: 10,
        },
      });
      const result = await service.countLinesOfCode({
        workspaceId: "workspace-id",
        startDate,
        endDate,
      });

      expect(buildAggregateMock).toBeCalledWith({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          linesOfCode: {
            not: null,
          },
          resource: {
            project: {
              workspaceId: "workspace-id",
              id: undefined,
            },
          },
        },
        _sum: {
          linesOfCode: true,
        },
      });

      expect(result).toBeDefined();
    });
  });

  describe("getAllAnalyticsResults", () => {
    it("should return usage insights", async () => {
      const mockedQueryRawResult: QueryRawResult[] = [
        {
          year: 2021,
          count: 4n,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          time_group: 3,
        },
        {
          year: 2022,
          count: 7n,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          time_group: 5,
        },
      ];

      prismaQueryRawMock.mockResolvedValue(mockedQueryRawResult);

      const startDate = new Date();
      const endDate = new Date();

      jest.spyOn(service, "countLinesOfCode").mockResolvedValueOnce(100);

      const result = await service.getUsageInsights({
        workspaceId: "workspace-id",
        projectId: "project-id",
        startDate,
        endDate,
      });

      const expectedResults = {
        builds: {
          results: [
            {
              metrics: [
                {
                  count: 4,
                  timeGroup: "3",
                },
              ],
              year: "2021",
            },
            {
              metrics: [
                {
                  count: 7,
                  timeGroup: "5",
                },
              ],
              year: "2022",
            },
          ],
        },
        entities: {
          results: [
            {
              metrics: [
                {
                  count: 4,
                  timeGroup: "3",
                },
              ],
              year: "2021",
            },
            {
              metrics: [
                {
                  count: 7,
                  timeGroup: "5",
                },
              ],
              year: "2022",
            },
          ],
        },
        plugins: {
          results: [
            {
              metrics: [
                {
                  count: 4,
                  timeGroup: "3",
                },
              ],
              year: "2021",
            },
            {
              metrics: [
                {
                  count: 7,
                  timeGroup: "5",
                },
              ],
              year: "2022",
            },
          ],
        },
        moduleActions: {
          results: [
            {
              metrics: [
                {
                  count: 4,
                  timeGroup: "3",
                },
              ],
              year: "2021",
            },
            {
              metrics: [
                {
                  count: 7,
                  timeGroup: "5",
                },
              ],
              year: "2022",
            },
          ],
        },
      };

      expect(result).toEqual(expectedResults);
    });

    it("should return evaluation insights", async () => {
      const mockedQueryRawResult: QueryRawResult[] = [
        {
          year: 2021,
          count: 4n,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          time_group: 3,
        },
        {
          year: 2022,
          count: 7n,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          time_group: 5,
        },
      ];

      prismaQueryRawMock.mockResolvedValue(mockedQueryRawResult);

      const startDate = new Date();
      const endDate = new Date();

      jest.spyOn(service, "countLinesOfCode").mockResolvedValueOnce(100);

      const result = await service.getEvaluationInsights({
        workspaceId: "workspace-id",
        projectId: "project-id",
        startDate,
        endDate,
      });

      const expectedResults = {
        costSaved: 1200,
        codeQuality: 1,
        timeSaved: 10,
        loc: 100,
      };

      expect(result).toEqual(expectedResults);
    });
  });
});
