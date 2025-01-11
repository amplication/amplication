/* eslint-disable @typescript-eslint/naming-convention */
import { SegmentAnalyticsService } from "./segmentAnalytics.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Analytics } from "@segment/analytics-node";
import { PrismaService } from "../../prisma";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { EnumEventType } from "./segmentAnalytics.types";
import { RequestContext } from "nestjs-request-context";

jest.mock("@segment/analytics-node");

let service: SegmentAnalyticsService;
const prismaResourceFindUniqueMock = jest.fn();

describe("SegmentAnalyticsService", () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SegmentAnalyticsService,
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            resource: {
              findUnique: prismaResourceFindUniqueMock,
            },
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

  it("should identify with account data and anonymous id if present", async () => {
    jest.spyOn(RequestContext, "currentContext", "get").mockReturnValue({
      req: {
        analyticsSessionId: "123",
      },
      res: {},
    });

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

  describe("trackWithContext", () => {
    it("should autopopulate user, workspace data", async () => {
      const accountId = "accountId";
      const data = {
        event: EnumEventType.EntityCreate,
        properties: {
          entityName: "entityName",
        },
      };
      jest.spyOn(RequestContext, "currentContext", "get").mockReturnValue({
        req: {
          user: {
            accountId,
            workspaceId: "workspaceId",
          },
        },
        res: {},
      });

      await service.trackWithContext(data);

      expect(prismaResourceFindUniqueMock).toHaveBeenCalledTimes(0);
      expect(Analytics.prototype.track).toBeCalledWith({
        event: EnumEventType.EntityCreate,
        userId: accountId,
        properties: {
          workspaceId: "workspaceId",
          entityName: "entityName",
          $groups: {
            groupWorkspace: "workspaceId",
          },
          source: "amplication-server",
        },
        context: {
          amplication: {},
        },
      });
    });

    describe("when resourceId is passed", () => {
      let resourceId: string;
      let expectedAccountId: string;

      beforeEach(() => {
        expectedAccountId = "accountId";
        jest.spyOn(RequestContext, "currentContext", "get").mockReturnValue({
          req: {
            user: {
              accountId: expectedAccountId,
              workspaceId: "workspaceId",
            },
          },
          res: {},
        });

        resourceId = "resourceId";
      });

      it("when projectId is not passed should autopopulate it from resourceId", async () => {
        const projectId = "projectId";

        const data = {
          event: EnumEventType.EntityCreate,
          properties: {
            resourceId,
          },
        };
        prismaResourceFindUniqueMock.mockResolvedValue({
          projectId: projectId,
        });

        await service.trackWithContext(data);

        expect(prismaResourceFindUniqueMock).toHaveBeenCalledTimes(1);

        expect(Analytics.prototype.track).toBeCalledWith({
          event: EnumEventType.EntityCreate,
          userId: expectedAccountId,
          properties: {
            workspaceId: "workspaceId",
            resourceId,
            projectId,
            $groups: {
              groupWorkspace: "workspaceId",
            },
            source: "amplication-server",
          },
          context: {
            amplication: {},
          },
        });
      });

      it("when projectId is passed should use it and not making any db query", async () => {
        const resourceId = "resourceId";
        const projectId = "projectId";

        const data = {
          event: EnumEventType.EntityCreate,
          properties: {
            resourceId,
            projectId,
          },
        };

        await service.trackWithContext(data);

        expect(prismaResourceFindUniqueMock).toHaveBeenCalledTimes(0);
        expect(Analytics.prototype.track).toBeCalledWith({
          event: EnumEventType.EntityCreate,
          userId: expectedAccountId,
          properties: {
            workspaceId: "workspaceId",
            resourceId,
            projectId,
            $groups: {
              groupWorkspace: "workspaceId",
            },
            source: "amplication-server",
          },
          context: {
            amplication: {},
          },
        });
      });
    });
  });
});
