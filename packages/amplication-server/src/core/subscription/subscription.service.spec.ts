import { Test, TestingModule } from "@nestjs/testing";
import { SubscriptionService } from "./subscription.service";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { EnumResourceType, PrismaService } from "../../prisma";
import { BillingService } from "../billing/billing.service";
import { MeteredEntitlement } from "@stigg/node-server-sdk";
import { Project, Resource, Workspace } from "../../models";
import { MockedSegmentAnalyticsProvider } from "../../services/segmentAnalytics/tests";

const EXAMPLE_WORKSPACE_ID = "exampleWorkspaceId";
const EXAMPLE_PROJECT_ID_1 = "exampleProjectId_1";
const EXAMPLE_PROJECT_ID_2 = "exampleProjectId_2";
const EXAMPLE_PROJECT_ID_3 = "exampleProjectId_3";

const EXAMPLE_RESOURCE_ID_1 = "exampleResourceId_1";
const EXAMPLE_RESOURCE_ID_2 = "exampleResourceId_2";
const EXAMPLE_RESOURCE_ID_3 = "exampleResourceId_3";

const EXAMPLE_WORKSPACE: Workspace = {
  id: EXAMPLE_WORKSPACE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as Workspace;

const EXAMPLE_PROJECT: Project = {
  id: EXAMPLE_PROJECT_ID_1,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspace: EXAMPLE_WORKSPACE,
  workspaceId: EXAMPLE_WORKSPACE_ID,
  useDemoRepo: false,
  demoRepoName: undefined,
  licensed: true,
} as unknown as Project;

const EXAMPLE_RESOURCE: Resource = {
  id: EXAMPLE_RESOURCE_ID_1,
  resourceType: EnumResourceType.Service,
  createdAt: new Date(),
  updatedAt: new Date(),
  licensed: true,
} as unknown as Resource;

const prismaProjectFindManyMock = jest.fn(() => {
  return [
    EXAMPLE_PROJECT,
    { ...EXAMPLE_PROJECT, id: EXAMPLE_PROJECT_ID_2 },
    { ...EXAMPLE_PROJECT, id: EXAMPLE_PROJECT_ID_3 },
  ];
});

const prismaResourceFindManyMock = jest.fn(() => {
  return [
    EXAMPLE_RESOURCE,
    { ...EXAMPLE_RESOURCE, id: EXAMPLE_RESOURCE_ID_2 },
    { ...EXAMPLE_RESOURCE, id: EXAMPLE_RESOURCE_ID_3 },
  ];
});

const prismaProjectUpdateManyMock = jest.fn();

const prismaResourceUpdateManyMock = jest.fn();

const billingServiceIsBillingEnabledMock = jest.fn();

const billingServiceMock = {
  getMeteredEntitlement: jest.fn(() => {
    return {
      usageLimit: undefined,
    } as unknown as MeteredEntitlement;
  }),
};
Object.defineProperty(billingServiceMock, "isBillingEnabled", {
  get: billingServiceIsBillingEnabledMock,
});

describe("SubscriptionService", () => {
  let service: SubscriptionService;
  beforeAll(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        MockedAmplicationLoggerProvider,
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            project: {
              findMany: prismaProjectFindManyMock,
              updateMany: prismaProjectUpdateManyMock,
            },
            resource: {
              findMany: prismaResourceFindManyMock,
              updateMany: prismaResourceUpdateManyMock,
            },
            $transaction: jest
              .fn()
              .mockImplementation((transactions) => Promise.all(transactions)),
          })),
        },
        { provide: BillingService, useValue: billingServiceMock },
        MockedSegmentAnalyticsProvider(),
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("when updateProjectLicensed is called", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("when the billing is not enabled", () => {
      beforeEach(() => {
        billingServiceIsBillingEnabledMock.mockReturnValue(false);
      });
      it("should do nothing", async () => {
        await service.updateProjectLicensed(EXAMPLE_WORKSPACE_ID);
        expect(billingServiceMock.getMeteredEntitlement).not.toHaveBeenCalled();
        expect(prismaProjectFindManyMock).not.toHaveBeenCalled();
        expect(prismaProjectUpdateManyMock).not.toHaveBeenCalled();
      });
    });

    describe("when the billing is enabled", () => {
      beforeEach(() => {
        billingServiceIsBillingEnabledMock.mockReturnValue(true);
      });
      it("should update all projects with licensed true when there is no limit", async () => {
        billingServiceMock.getMeteredEntitlement.mockReturnValue({
          usageLimit: undefined,
        } as unknown as MeteredEntitlement);

        await service.updateProjectLicensed(EXAMPLE_WORKSPACE_ID);

        expect(prismaProjectUpdateManyMock).toHaveBeenCalledTimes(1);
        expect(prismaProjectUpdateManyMock).toHaveBeenCalledWith({
          where: {
            workspaceId: EXAMPLE_WORKSPACE_ID,
            deletedAt: null,
          },
          data: {
            licensed: true,
          },
        });
        expect(prismaProjectFindManyMock).toHaveBeenCalledTimes(0);
      });

      it("should update the first project with licensed true and the the second and the third projects with licensed false when the usage limitation is 1", async () => {
        billingServiceMock.getMeteredEntitlement.mockReturnValue({
          usageLimit: 1,
        } as unknown as MeteredEntitlement);

        await service.updateProjectLicensed(EXAMPLE_WORKSPACE_ID);

        expect(prismaProjectUpdateManyMock).toHaveBeenCalledTimes(2);
        expect(prismaProjectUpdateManyMock).toHaveBeenNthCalledWith(1, {
          where: {
            id: {
              in: [EXAMPLE_PROJECT_ID_1],
            },
          },
          data: {
            licensed: true,
          },
        });
        expect(prismaProjectUpdateManyMock).toHaveBeenNthCalledWith(2, {
          where: {
            id: {
              in: [EXAMPLE_PROJECT_ID_2, EXAMPLE_PROJECT_ID_3],
            },
          },
          data: {
            licensed: false,
          },
        });
      });
    });
  });

  describe("when updateServiceLicensed is called", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("when the billing is not enabled", () => {
      beforeEach(() => {
        billingServiceIsBillingEnabledMock.mockReturnValue(false);
      });
      it("should do nothing", async () => {
        await service.updateServiceLicensed(EXAMPLE_WORKSPACE_ID);
        expect(billingServiceMock.getMeteredEntitlement).not.toHaveBeenCalled();
        expect(prismaResourceFindManyMock).not.toHaveBeenCalled();
        expect(prismaResourceUpdateManyMock).not.toHaveBeenCalled();
      });
    });

    describe("when the billing is enabled", () => {
      beforeEach(() => {
        billingServiceIsBillingEnabledMock.mockReturnValue(true);
      });
      it("should update all services with licensed true when there is no limit", async () => {
        billingServiceMock.getMeteredEntitlement.mockReturnValue({
          usageLimit: undefined,
        } as unknown as MeteredEntitlement);

        await service.updateServiceLicensed(EXAMPLE_WORKSPACE_ID);

        expect(prismaResourceUpdateManyMock).toHaveBeenCalledTimes(1);
        expect(prismaResourceUpdateManyMock).toHaveBeenCalledWith({
          where: {
            project: {
              workspaceId: EXAMPLE_WORKSPACE_ID,
            },
            deletedAt: null,
            archived: { not: true },
            resourceType: {
              in: [EnumResourceType.Service],
            },
          },
          data: {
            licensed: true,
          },
        });
        expect(prismaResourceFindManyMock).toHaveBeenCalledTimes(0);
      });

      it("should update the first service with licensed true and the the second and the third services with licensed false when the usage limitation is 1", async () => {
        billingServiceMock.getMeteredEntitlement.mockReturnValue({
          usageLimit: 1,
        } as unknown as MeteredEntitlement);

        await service.updateServiceLicensed(EXAMPLE_WORKSPACE_ID);

        expect(prismaResourceUpdateManyMock).toHaveBeenCalledTimes(2);
        expect(prismaResourceUpdateManyMock).toHaveBeenNthCalledWith(1, {
          where: {
            id: {
              in: [EXAMPLE_RESOURCE_ID_1],
            },
          },
          data: {
            licensed: true,
          },
        });
        expect(prismaResourceUpdateManyMock).toHaveBeenNthCalledWith(2, {
          where: {
            id: {
              in: [EXAMPLE_RESOURCE_ID_2, EXAMPLE_RESOURCE_ID_3],
            },
          },
          data: {
            licensed: false,
          },
        });
      });
    });
  });
});
