import { Test, TestingModule } from "@nestjs/testing";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { UsageInsightsService } from "./usageInsights.service";
import { PrismaService } from "../../prisma";
import { QueryRawResult } from "./types";
import { UsageInsightsResult } from "./dtos/UsageInsights.object";

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

  describe("Count lines of code added orUpdated for builds", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    const now = new Date();
    const projectIds = ["project-id"];

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
        projectIds,
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
              id: {
                in: projectIds,
              },
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
        projectIds,
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
              id: {
                in: projectIds,
              },
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

  describe("Get all usage and evaluation insights", () => {
    it("should return usage insights", async () => {
      const mockedQueryRawResult: QueryRawResult[] = [
        {
          year: 2021,
          month: 3,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          time_group: 3,
          count: 4n,
        },
        {
          year: 2022,
          month: 5,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          time_group: 5,
          count: 7n,
        },
      ];

      prismaQueryRawMock.mockResolvedValue(mockedQueryRawResult);

      const startDate = new Date();
      const endDate = new Date();
      const projectIds = ["project-id"];

      jest.spyOn(service, "countLinesOfCode").mockResolvedValueOnce(100);

      const result = await service.getUsageInsights({
        projectIds,
        startDate,
        endDate,
      });

      const expectedResults: UsageInsightsResult = {
        builds: {
          results: [
            {
              year: 2021,
              month: 3,
              timeGroup: 3,
              count: 4,
            },
            {
              year: 2022,
              month: 5,
              timeGroup: 5,
              count: 7,
            },
          ],
        },
        entities: {
          results: [
            {
              year: 2021,
              month: 3,
              timeGroup: 3,
              count: 4,
            },
            {
              year: 2022,
              month: 5,
              timeGroup: 5,
              count: 7,
            },
          ],
        },
        plugins: {
          results: [
            {
              year: 2021,
              month: 3,
              timeGroup: 3,
              count: 4,
            },
            {
              year: 2022,
              month: 5,
              timeGroup: 5,
              count: 7,
            },
          ],
        },
        moduleActions: {
          results: [
            {
              year: 2021,
              month: 3,
              timeGroup: 3,
              count: 4,
            },
            {
              year: 2022,
              month: 5,
              timeGroup: 5,
              count: 7,
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
          month: 3,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          time_group: 3,
          count: 4n,
        },
        {
          year: 2022,
          month: 5,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          time_group: 5,
          count: 7n,
        },
      ];

      prismaQueryRawMock.mockResolvedValue(mockedQueryRawResult);

      const startDate = new Date();
      const endDate = new Date();
      const projectIds = ["project-id"];

      jest.spyOn(service, "countLinesOfCode").mockResolvedValueOnce(100);

      const result = await service.getEvaluationInsights({
        projectIds,
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
