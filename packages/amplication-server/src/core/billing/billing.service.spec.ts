import { Test, TestingModule } from "@nestjs/testing";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { BillingService } from "./billing.service";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { BillingPlan, BillingFeature } from "./billing.types";
import Stigg, {
  BooleanEntitlement,
  MeteredEntitlement,
  NumericEntitlement,
} from "@stigg/node-server-sdk";
import { Project, User } from "../../models";
import { ValidationError } from "apollo-server-express";

jest.mock("@stigg/node-server-sdk");
Stigg.initialize = jest.fn().mockReturnValue(Stigg.prototype);
Stigg.prototype.waitForInitialization = jest
  .fn()
  .mockResolvedValue(Stigg.prototype);

describe("BillingService", () => {
  let service: BillingService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: SegmentAnalyticsService,
          useValue: {
            track: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case Env.BILLING_ENABLED:
                  return "true";
                default:
                  return "";
              }
            },
          },
        },
        MockedAmplicationLoggerProvider,
        BillingService,
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should provision customer and not sync free plans to Stripe", async () => {
    const spyOnStiggProvisionCustomer = jest.spyOn(
      Stigg.prototype,
      "provisionCustomer"
    );

    await service.provisionCustomer("id", BillingPlan.Free);

    expect(spyOnStiggProvisionCustomer).toHaveBeenCalledTimes(1);
    expect(spyOnStiggProvisionCustomer).toHaveBeenCalledWith(
      expect.objectContaining({
        shouldSyncFree: false,
      })
    );
  });

  it("should throw exceptions on number of projects if the workspace has no entitlement to bypass code generation limitation and the current project is out of the limitation based on the number of allowed projects and its creation date", async () => {
    const workspaceId = "id";
    const projectsPerWorkspaceLimit = 1;

    const spyOnServiceGetBooleanEntitlement = jest
      .spyOn(service, "getBooleanEntitlement")
      .mockResolvedValue({
        hasAccess: false,
      } as BooleanEntitlement);

    const spyOnServiceGetMeteredEntitlement = jest
      .spyOn(service, "getMeteredEntitlement")
      .mockResolvedValue({
        hasAccess: false,
        usageLimit: projectsPerWorkspaceLimit,
      } as MeteredEntitlement);

    const user: User = {
      id: "user-id",
      account: {
        id: "account-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        email: "email",
        firstName: "first-name",
        lastName: "last-name",
        password: "password",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isOwner: true,
    };

    const projects: Project[] = [
      {
        id: "project-id-1",
        name: "project-1",
        workspaceId: workspaceId,
        useDemoRepo: false,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date(),
      },
      {
        id: "project-id-2",
        name: "project-2",
        workspaceId: workspaceId,
        useDemoRepo: false,
        createdAt: new Date("2023-01-02"),
        updatedAt: new Date(),
      },
    ];

    await expect(
      service.validateSubscriptionPlanLimitationsForWorkspace(
        workspaceId,
        user,
        "project-id-2",
        projects
      )
    ).rejects.toThrow(
      new ValidationError("LimitationError: Allowed projects per workspace: 1")
    );

    expect(spyOnServiceGetBooleanEntitlement).toHaveBeenCalledTimes(1);
    expect(spyOnServiceGetBooleanEntitlement).toHaveBeenCalledWith(
      workspaceId,
      BillingFeature.IgnoreValidationCodeGeneration
    );
    expect(spyOnServiceGetMeteredEntitlement).toHaveBeenCalledTimes(1);
    expect(spyOnServiceGetMeteredEntitlement).toHaveBeenNthCalledWith(
      1,
      workspaceId,
      BillingFeature.Projects
    );
  });

  it("should throw exceptions on number of services if the workspace has no entitlement to bypass code generation limitation", async () => {
    const workspaceId = "id";
    const projectId = "project-id-1";
    const servicesPerWorkspaceLimit = 3;

    const spyOnServiceGetBooleanEntitlement = jest
      .spyOn(service, "getBooleanEntitlement")
      .mockResolvedValue({
        hasAccess: false,
      } as BooleanEntitlement);

    const spyOnServiceGetMeteredEntitlement = jest
      .spyOn(service, "getMeteredEntitlement")
      .mockResolvedValue({
        hasAccess: false,
        usageLimit: servicesPerWorkspaceLimit,
      } as MeteredEntitlement);

    const user: User = {
      id: "user-id",
      account: {
        id: "account-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        email: "email",
        firstName: "first-name",
        lastName: "last-name",
        password: "password",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isOwner: true,
    };

    const projects: Project[] = [
      {
        id: projectId,
        name: "project-1",
        workspaceId: workspaceId,
        useDemoRepo: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await expect(
      service.validateSubscriptionPlanLimitationsForWorkspace(
        workspaceId,
        user,
        projectId,
        projects
      )
    ).rejects.toThrow(
      new ValidationError("LimitationError: Allowed services per workspace: 3")
    );

    expect(spyOnServiceGetBooleanEntitlement).toHaveBeenCalledTimes(1);
    expect(spyOnServiceGetBooleanEntitlement).toHaveBeenCalledWith(
      workspaceId,
      BillingFeature.IgnoreValidationCodeGeneration
    );
    await expect(
      service.getBooleanEntitlement(
        workspaceId,
        BillingFeature.IgnoreValidationCodeGeneration
      )
    ).resolves.toEqual(
      expect.objectContaining({
        hasAccess: false,
      })
    );

    expect(spyOnServiceGetMeteredEntitlement).toHaveBeenCalledTimes(2);
    expect(spyOnServiceGetMeteredEntitlement).toHaveBeenNthCalledWith(
      1,
      workspaceId,
      BillingFeature.Projects
    );
    expect(spyOnServiceGetMeteredEntitlement).toHaveBeenNthCalledWith(
      2,
      workspaceId,
      BillingFeature.Services
    );
    await expect(
      service.getMeteredEntitlement(workspaceId, BillingFeature.Services)
    ).resolves.toEqual(
      expect.objectContaining({
        hasAccess: false,
      })
    );
  });

  it("should throw exceptions on number of entities per service if the workspace has no entitlement to bypass code generation limitation", async () => {
    const workspaceId = "id";
    const projectId = "project-id-1";
    const projectsPerWorkspaceLimit = 1;
    const entitiesPerServiceLimit = 5;
    const servicesPerWorkspaceLimit = 3;

    const spyOnServiceGetBooleanEntitlement = jest
      .spyOn(service, "getBooleanEntitlement")
      .mockResolvedValue({
        hasAccess: false,
      } as BooleanEntitlement);

    const spyOnServiceGetMeteredEntitlement = jest
      .spyOn(service, "getMeteredEntitlement")
      .mockResolvedValueOnce({
        hasAccess: true,
        usageLimit: servicesPerWorkspaceLimit,
      } as MeteredEntitlement)
      .mockResolvedValueOnce({
        hasAccess: true,
        usageLimit: projectsPerWorkspaceLimit,
      } as MeteredEntitlement)
      .mockResolvedValueOnce({
        hasAccess: false,
        usageLimit: entitiesPerServiceLimit,
      } as MeteredEntitlement);

    const spyOnServiceGetNumericEntitlement = jest
      .spyOn(service, "getNumericEntitlement")
      .mockResolvedValue({
        value: entitiesPerServiceLimit,
      } as NumericEntitlement);

    const user: User = {
      id: "user-id",
      account: {
        id: "account-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        email: "email",
        firstName: "first-name",
        lastName: "last-name",
        password: "password",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isOwner: true,
    };

    const projects: Project[] = [
      {
        id: projectId,
        name: "project-1",
        workspaceId: workspaceId,
        useDemoRepo: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await expect(
      service.validateSubscriptionPlanLimitationsForWorkspace(
        workspaceId,
        user,
        projectId,
        projects
      )
    ).rejects.toThrow(
      new ValidationError("LimitationError: Allowed entities per service: 5")
    );

    expect(spyOnServiceGetBooleanEntitlement).toHaveBeenCalledTimes(1);
    expect(spyOnServiceGetBooleanEntitlement).toHaveBeenCalledWith(
      workspaceId,
      BillingFeature.IgnoreValidationCodeGeneration
    );
    await expect(
      service.getBooleanEntitlement(
        workspaceId,
        BillingFeature.IgnoreValidationCodeGeneration
      )
    ).resolves.toEqual(
      expect.objectContaining({
        hasAccess: false,
      })
    );

    expect(spyOnServiceGetMeteredEntitlement).toHaveBeenCalledTimes(3);
    expect(spyOnServiceGetMeteredEntitlement).toHaveBeenNthCalledWith(
      1,
      workspaceId,
      BillingFeature.Projects
    );
    expect(spyOnServiceGetMeteredEntitlement).toHaveBeenNthCalledWith(
      2,
      workspaceId,
      BillingFeature.Services
    );
    expect(spyOnServiceGetMeteredEntitlement).toHaveBeenNthCalledWith(
      3,
      workspaceId,
      BillingFeature.ServicesAboveEntitiesPerServiceLimit
    );

    expect(spyOnServiceGetNumericEntitlement).toHaveBeenCalledTimes(1);
    expect(spyOnServiceGetNumericEntitlement).toHaveBeenCalledWith(
      workspaceId,
      BillingFeature.EntitiesPerService
    );
    await expect(
      service.getNumericEntitlement(
        workspaceId,
        BillingFeature.EntitiesPerService
      )
    ).resolves.toEqual(
      expect.objectContaining({
        value: 5,
      })
    );
  });
});
