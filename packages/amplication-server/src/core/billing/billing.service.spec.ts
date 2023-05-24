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
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { User } from "../../models";

jest.mock("@stigg/node-server-sdk");
Stigg.initialize = jest.fn().mockReturnValue(Stigg.prototype);
Stigg.prototype.waitForInitialization = jest
  .fn()
  .mockResolvedValue(Stigg.prototype);

describe("BillingService", () => {
  let service: BillingService;
  let logger: AmplicationLogger;

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
    logger = module.get<AmplicationLogger>(AmplicationLogger);
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

  it("should provide `info` level logs for business logs if the workspace has no entitlement to bypass code generation limitation", async () => {
    const workspaceId = "id";
    const servicesPerWorkspaceLimit = 3;
    const entitiesPerServiceLimit = 5;

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

    const spyOnServiceGetNumericEntitlement = jest
      .spyOn(service, "getNumericEntitlement")
      .mockResolvedValue({
        value: entitiesPerServiceLimit,
      } as NumericEntitlement);

    const spyOnLoggerLog = jest.spyOn(logger, "info");

    spyOnLoggerLog.mockReset();

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

    await service.validateSubscriptionPlanLimitationsForWorkspace(
      workspaceId,
      user
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
      BillingFeature.Services
    );
    await expect(
      service.getMeteredEntitlement(workspaceId, BillingFeature.Services)
    ).resolves.toEqual(
      expect.objectContaining({
        hasAccess: false,
      })
    );
    expect(spyOnServiceGetMeteredEntitlement).toHaveBeenNthCalledWith(
      2,
      workspaceId,
      BillingFeature.ServicesAboveEntitiesPerServiceLimit
    );
    await expect(
      service.getMeteredEntitlement(
        workspaceId,
        BillingFeature.ServicesAboveEntitiesPerServiceLimit
      )
    ).resolves.toEqual(
      expect.objectContaining({
        hasAccess: false,
      })
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

    expect(logger.info).toHaveBeenCalledTimes(2);
    expect(logger.info).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(
        `LimitationError: Allowed services per workspace: ${servicesPerWorkspaceLimit}`
      )
    );
    expect(logger.info).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(
        `LimitationError: Allowed entities per service: ${entitiesPerServiceLimit}`
      )
    );
  });
});
