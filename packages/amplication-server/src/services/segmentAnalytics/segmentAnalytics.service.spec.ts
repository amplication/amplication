/* eslint-disable @typescript-eslint/naming-convention */
import { SegmentAnalyticsService } from "./segmentAnalytics.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Analytics } from "@segment/analytics-node";
import { PrismaService } from "../../prisma";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";

jest.mock("@segment/analytics-node");
jest.mock("nestjs-request-context", () => ({
  RequestContext: {
    currentContext: {
      req: {
        analyticsSessionId: "123",
      },
      res: undefined,
    },
  },
}));

let service: SegmentAnalyticsService;
describe("SegmentAnalyticsService", () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SegmentAnalyticsService,
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            // resource: {
            //   // findUnique: prismaResourceFindUniqueMock,
            // },
          })),
        },
        MockedAmplicationLoggerProvider,
        {
          provide: "SEGMENT_ANALYTICS_OPTIONS",
          useValue: {
            segmentWriteKey: "segmentWriteKey",
          },
        },
      ],
    }).compile();

    service = module.get<SegmentAnalyticsService>(SegmentAnalyticsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should indentify with account data and anonymous id if present", async () => {
    const data = {
      accountId: "accountId",
      createdAt: new Date(),
      email: "email",
      firstName: "firstName",
      lastName: "lastName",
    };
    // Test case
    await service.identify(data);

    expect(Analytics.prototype.identify).toBeCalledWith({
      userId: "accountId",
      anonymousId: "123",
      traits: data,
    });
  });
});
