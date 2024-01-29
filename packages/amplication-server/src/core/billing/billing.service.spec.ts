import { Test, TestingModule } from "@nestjs/testing";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { BillingService } from "./billing.service";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import {
  BillingPlan,
  BillingFeature,
  BillingAddon,
} from "@amplication/util-billing-types";
import Stigg, {
  BooleanEntitlement,
  FullSubscription,
  MeteredEntitlement,
  SubscriptionStatus,
  UsageUpdateBehavior,
} from "@stigg/node-server-sdk";
import { GitOrganization, GitRepository, Project, User } from "../../models";
import { EnumSubscriptionPlan, EnumSubscriptionStatus } from "../../prisma";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { EnumGitProvider } from "../git/dto/enums/EnumGitProvider";
import { EnumPreviewAccountType } from "../auth/dto/EnumPreviewAccountType";

jest.mock("@stigg/node-server-sdk");
Stigg.initialize = jest.fn().mockReturnValue(Stigg.prototype);
Stigg.prototype.waitForInitialization = jest
  .fn()
  .mockResolvedValue(Stigg.prototype);

describe("BillingService", () => {
  let service: BillingService;

  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(async () => {
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

  describe("getSubscription, as amplication always have only one subscription", () => {
    it.each([
      [
        BillingPlan.Free,
        SubscriptionStatus.Active,
        EnumSubscriptionStatus.Active,
        EnumSubscriptionPlan.Free,
      ],
      [
        BillingPlan.Enterprise,
        SubscriptionStatus.Active,
        EnumSubscriptionStatus.Active,
        EnumSubscriptionPlan.Enterprise,
      ],
      [
        BillingPlan.Enterprise,
        SubscriptionStatus.InTrial,
        EnumSubscriptionStatus.Trailing,
        EnumSubscriptionPlan.Enterprise,
      ],
    ])(
      "should return %s subscription when subscription status is %s",
      async (
        planId,
        subscriptionStatus,
        expectSubscriptionStatus,
        expectSubscriptionPlanId
      ) => {
        // Arrange
        const spyOnStiggGetActiveSubscriptions = jest.spyOn(
          Stigg.prototype,
          "getActiveSubscriptions"
        );

        spyOnStiggGetActiveSubscriptions.mockResolvedValue([
          <FullSubscription>{
            id: "id",
            status: subscriptionStatus,
            plan: {
              id: planId,
            },
          },
        ]);

        const workspaceId = "workspace-id";
        // Act
        const result = await service.getSubscription(workspaceId);

        // Assert
        expect(result).toEqual({
          id: "id",
          status: expectSubscriptionStatus,
          workspaceId,
          subscriptionPlan: expectSubscriptionPlanId,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      }
    );

    it.each([
      SubscriptionStatus.Canceled,
      SubscriptionStatus.Expired,
      SubscriptionStatus.NotStarted,
      SubscriptionStatus.PaymentPending,
    ])(
      "should return null as subscription when subscription status is %s",
      async (subscriptionStatus) => {
        // Arrange
        const spyOnStiggGetActiveSubscriptions = jest.spyOn(
          Stigg.prototype,
          "getActiveSubscriptions"
        );

        spyOnStiggGetActiveSubscriptions.mockResolvedValue([]);

        const workspaceId = "workspace-id";
        // Act
        const result = await service.getSubscription(workspaceId);

        // Assert
        expect(result).toBeNull();
      }
    );
  });

  describe("provisionCustomer", () => {
    it("should provision customer and not sync free plans to Stripe", async () => {
      const spyOnStiggProvisionCustomer = jest.spyOn(
        Stigg.prototype,
        "provisionCustomer"
      );

      await service.provisionCustomer("id");

      expect(spyOnStiggProvisionCustomer).toHaveBeenCalledTimes(1);
      expect(spyOnStiggProvisionCustomer).toHaveBeenCalledWith(
        expect.objectContaining({
          shouldSyncFree: false,
        })
      );
    });
  });

  it("should provision customer with default plan: enterprise with custom actions addon", async () => {
    const expectedWorkspaceId = "id";
    const spyOnStiggProvisionCustomer = jest.spyOn(
      Stigg.prototype,
      "provisionCustomer"
    );

    await service.provisionCustomer(expectedWorkspaceId);

    expect(spyOnStiggProvisionCustomer).toHaveBeenCalledTimes(1);
    expect(spyOnStiggProvisionCustomer).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: expectedWorkspaceId,
        subscriptionParams: {
          planId: BillingPlan.Enterprise,
          addons: [
            {
              addonId: BillingAddon.CustomActions,
            },
          ],
        },
      })
    );
  });

  describe("validateSubscriptionPlanLimitationsForWorkspace", () => {
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
          previewAccountType: EnumPreviewAccountType.None,
          previewAccountEmail: null,
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
          licensed: true,
        },
      ];
      const repositories: GitRepository[] = [
        {
          gitOrganizationId: "git-organization-id",
          name: "git-repository-name",
          createdAt: new Date(),
          updatedAt: new Date(),
          id: "git-repository-id",
          gitOrganization: {
            provider: EnumGitProvider.Github,
            id: "git-organization-id",
          } as unknown as GitOrganization,
        },
      ];

      await expect(
        service.validateSubscriptionPlanLimitationsForWorkspace({
          workspaceId,
          currentUser: user,
          currentProjectId: projectId,
          projects,
          repositories,
        })
      ).rejects.toThrow(
        new BillingLimitationError(
          "Your workspace exceeds its resource limitation.",
          BillingFeature.Services
        )
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
    });

    it("should throw exceptions on number of team members if the workspace has no entitlement to bypass code generation limitation", async () => {
      const workspaceId = "id";
      const projectId = "project-id-1";
      const projectsPerWorkspaceLimit = 1;
      const entitiesPerServiceLimit = 5;
      const servicesPerWorkspaceLimit = 3;
      const teamMembersPerWorkspaceLimit = 2;

      const spyOnServiceGetBooleanEntitlement = jest
        .spyOn(service, "getBooleanEntitlement")
        .mockResolvedValue({
          hasAccess: false,
        } as BooleanEntitlement);

      const spyOnServiceGetMeteredEntitlement = jest
        .spyOn(service, "getMeteredEntitlement")
        .mockImplementation(async (workspaceId, feature) => {
          switch (feature) {
            case BillingFeature.Projects:
              return {
                hasAccess: true,
                usageLimit: projectsPerWorkspaceLimit,
              } as MeteredEntitlement;
            case BillingFeature.Services:
              return {
                hasAccess: true,
                usageLimit: servicesPerWorkspaceLimit,
              } as MeteredEntitlement;
            case BillingFeature.ServicesAboveEntitiesPerServiceLimit:
              return {
                hasAccess: false,
                usageLimit: entitiesPerServiceLimit,
              } as MeteredEntitlement;
            case BillingFeature.TeamMembers:
              return {
                hasAccess: false,
                usageLimit: teamMembersPerWorkspaceLimit,
              } as MeteredEntitlement;
          }
        });

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
          previewAccountType: EnumPreviewAccountType.None,
          previewAccountEmail: null,
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
          licensed: true,
        },
      ];

      const repositories: GitRepository[] = [
        {
          gitOrganizationId: "git-organization-id",
          name: "git-repository-name",
          createdAt: new Date(),
          updatedAt: new Date(),
          id: "git-repository-id",
          gitOrganization: {
            provider: EnumGitProvider.Github,
            id: "git-organization-id",
          } as unknown as GitOrganization,
        },
      ];

      await expect(
        service.validateSubscriptionPlanLimitationsForWorkspace({
          workspaceId,
          currentUser: user,
          currentProjectId: projectId,
          projects,
          repositories,
        })
      ).rejects.toThrow(
        new BillingLimitationError(
          "Your workspace exceeds its team member limitation.",
          BillingFeature.TeamMembers
        )
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
      expect(spyOnServiceGetMeteredEntitlement).toHaveBeenNthCalledWith(
        2,
        workspaceId,
        BillingFeature.TeamMembers
      );
    });

    it.each([
      EnumGitProvider.AwsCodeCommit,
      EnumGitProvider.Bitbucket,
      EnumGitProvider.GitLab,
    ])(
      "should throw exception when using %s git provider if the workspace has no entitlement or bypass code generation limitation",
      async (currentGitProvider) => {
        const workspaceId = "id";
        const projectId = "project-id-1";

        const spyOnServiceGetBooleanEntitlement = jest
          .spyOn(service, "getBooleanEntitlement")
          .mockImplementation(async (workspaceId, feature) => {
            switch (feature) {
              case BillingFeature[
                currentGitProvider as keyof typeof BillingFeature
              ]:
              case BillingFeature.IgnoreValidationCodeGeneration:
                return {
                  hasAccess: false,
                } as BooleanEntitlement;

              default:
                return {
                  hasAccess: true,
                } as BooleanEntitlement;
            }
          });

        jest.spyOn(service, "getMeteredEntitlement").mockResolvedValue({
          hasAccess: true,
          usageLimit: 1000,
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
            previewAccountType: EnumPreviewAccountType.None,
            previewAccountEmail: null,
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
            licensed: true,
          },
        ];

        const repositories: GitRepository[] = [
          {
            gitOrganizationId: "git-organization-id",
            name: "git-repository-name",
            createdAt: new Date(),
            updatedAt: new Date(),
            id: "git-repository-id",
            gitOrganization: {
              provider: EnumGitProvider[currentGitProvider],
              id: "git-organization-id",
            } as unknown as GitOrganization,
          },
        ];

        await expect(
          service.validateSubscriptionPlanLimitationsForWorkspace({
            workspaceId,
            currentUser: user,
            currentProjectId: projectId,
            projects,
            repositories,
          })
        ).rejects.toThrow(
          new BillingLimitationError(
            `Your workspace uses ${currentGitProvider} integration, while it is not part of your current plan.`,
            BillingFeature[currentGitProvider as keyof typeof BillingFeature]
          )
        );

        expect(spyOnServiceGetBooleanEntitlement).toHaveBeenCalledWith(
          workspaceId,
          BillingFeature.IgnoreValidationCodeGeneration
        );

        expect(spyOnServiceGetBooleanEntitlement).toHaveBeenCalledWith(
          workspaceId,
          BillingFeature[currentGitProvider as keyof typeof BillingFeature]
        );
      }
    );

    it.each([EnumGitProvider.Github])(
      "should not throw exception when using %s git provider as it is the default provider and never checked for entitlements",
      async (currentGitProvider) => {
        const workspaceId = "id";
        const projectId = "project-id-1";

        const spyOnServiceGetBooleanEntitlement = jest
          .spyOn(service, "getBooleanEntitlement")
          .mockImplementation(async (workspaceId, feature) => {
            switch (feature) {
              case BillingFeature[
                currentGitProvider as keyof typeof BillingFeature
              ]:
              case BillingFeature.IgnoreValidationCodeGeneration:
                return {
                  hasAccess: false,
                } as BooleanEntitlement;

              default:
                return {
                  hasAccess: true,
                } as BooleanEntitlement;
            }
          });

        jest.spyOn(service, "getMeteredEntitlement").mockResolvedValue({
          hasAccess: true,
          usageLimit: 1000,
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
            previewAccountType: EnumPreviewAccountType.None,
            previewAccountEmail: null,
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
            licensed: true,
          },
        ];

        const repositories: GitRepository[] = [
          {
            gitOrganizationId: "git-organization-id",
            name: "git-repository-name",
            createdAt: new Date(),
            updatedAt: new Date(),
            id: "git-repository-id",
            gitOrganization: {
              provider: EnumGitProvider[currentGitProvider],
              id: "git-organization-id",
            } as unknown as GitOrganization,
          },
        ];

        await service.validateSubscriptionPlanLimitationsForWorkspace({
          workspaceId,
          currentUser: user,
          currentProjectId: projectId,
          projects,
          repositories,
        });

        expect(spyOnServiceGetBooleanEntitlement).toHaveBeenCalledWith(
          workspaceId,
          BillingFeature.IgnoreValidationCodeGeneration
        );

        expect(spyOnServiceGetBooleanEntitlement).not.toHaveBeenCalledWith(
          workspaceId,
          BillingFeature[currentGitProvider as keyof typeof BillingFeature]
        );
      }
    );
  });

  it("should report usage as delta update by using the UsageUpdateBehavior.Delta", async () => {
    const reportUsage = jest.spyOn(Stigg.prototype, "reportUsage");

    await service.reportUsage("workspace-id", BillingFeature.Projects, 1);

    expect(reportUsage).toHaveBeenCalledTimes(1);
    expect(reportUsage).toHaveBeenCalledWith({
      customerId: "workspace-id",
      featureId: BillingFeature.Projects,
      updateBehavior: UsageUpdateBehavior.Delta,
      value: 1,
    });
  });

  it("should set usage overriding current usage by using the UsageUpdateBehavior.Set", async () => {
    const reportUsage = jest.spyOn(Stigg.prototype, "reportUsage");

    await service.setUsage("workspace-id", BillingFeature.Projects, 100);

    expect(reportUsage).toHaveBeenCalledTimes(1);
    expect(reportUsage).toHaveBeenCalledWith({
      customerId: "workspace-id",
      featureId: BillingFeature.Projects,
      updateBehavior: UsageUpdateBehavior.Set,
      value: 100,
    });
  });

  describe("resetUsage", () => {
    let mockReportUsage: jest.SpyInstance;
    beforeEach(() => {
      mockReportUsage = jest.spyOn(Stigg.prototype, "reportUsage");
    });
    it("should call setUsage for each feature when billing is enabled", async () => {
      // Arrange
      const workspaceId = "testWorkspaceId";
      const currentUsage = {
        projects: 5,
        services: 10,
        servicesAboveEntityPerServiceLimit: 2,
        teamMembers: 8,
      };
      jest.spyOn(service, "isBillingEnabled", "get").mockReturnValue(true);

      // Act
      await service.resetUsage(workspaceId, currentUsage);

      // Assert
      expect(mockReportUsage).toHaveBeenCalledTimes(4);

      expect(mockReportUsage).toHaveBeenCalledWith({
        customerId: workspaceId,
        featureId: BillingFeature.Projects,
        updateBehavior: UsageUpdateBehavior.Set,
        value: currentUsage.projects,
      });
      expect(mockReportUsage).toHaveBeenCalledWith({
        customerId: workspaceId,
        featureId: BillingFeature.Services,
        updateBehavior: UsageUpdateBehavior.Set,
        value: currentUsage.services,
      });
      expect(mockReportUsage).toHaveBeenCalledWith({
        customerId: workspaceId,
        featureId: BillingFeature.ServicesAboveEntitiesPerServiceLimit,
        updateBehavior: UsageUpdateBehavior.Set,
        value: currentUsage.servicesAboveEntityPerServiceLimit,
      });
      expect(mockReportUsage).toHaveBeenCalledWith({
        customerId: workspaceId,
        featureId: BillingFeature.TeamMembers,
        updateBehavior: UsageUpdateBehavior.Set,
        value: currentUsage.teamMembers,
      });
    });

    it("should not call setUsage when billing is disabled", async () => {
      // Arrange
      const workspaceId = "testWorkspaceId";
      const currentUsage = {
        projects: 5,
        services: 10,
        servicesAboveEntityPerServiceLimit: 2,
        teamMembers: 8,
      };

      jest.spyOn(service, "isBillingEnabled", "get").mockReturnValue(false);

      // Act
      await service.resetUsage(workspaceId, currentUsage);

      // Assert
      expect(mockReportUsage).not.toHaveBeenCalled();
    });
  });
});
