import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stigg, {
  BooleanEntitlement,
  MeteredEntitlement,
  NumericEntitlement,
  ReportUsageAck,
  SubscriptionStatus,
  UsageUpdateBehavior,
} from "@stigg/node-server-sdk";
import { Env } from "../../env";
import { EnumSubscriptionPlan } from "../subscription/dto";
import { EnumSubscriptionStatus } from "../subscription/dto/EnumSubscriptionStatus";
import { Subscription } from "../subscription/dto/Subscription";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { ProvisionSubscriptionResult } from "../workspace/dto/ProvisionSubscriptionResult";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { FeatureUsageReport } from "../project/FeatureUsageReport";
import { ProvisionSubscriptionInput } from "../workspace/dto/ProvisionSubscriptionInput";
import {
  BillingAddon,
  BillingFeature,
  BillingPlan,
} from "@amplication/util-billing-types";
import { ValidateSubscriptionPlanLimitationsArgs } from "./billing.service.types";
import { EnumGitProvider } from "../git/dto/enums/EnumGitProvider";
import { EnumPreviewAccountType } from "../auth/dto/EnumPreviewAccountType";

@Injectable()
export class BillingService {
  private readonly stiggClient: Stigg;
  private readonly clientHost: string;
  private billingEnabled: boolean;

  get isBillingEnabled(): boolean {
    return this.billingEnabled;
  }

  private get defaultSubscriptionPlan() {
    return {
      planId: BillingPlan.Enterprise,
      addons: [
        {
          addonId: BillingAddon.CustomActions,
        },
      ],
    };
  }

  constructor(
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly analytics: SegmentAnalyticsService,
    configService: ConfigService
  ) {
    try {
      this.logger.info("starting billing service");

      this.billingEnabled = Boolean(
        configService.get<string>(Env.BILLING_ENABLED) === "true"
      );

      if (this.isBillingEnabled) {
        const stiggApiKey = configService.get(Env.BILLING_API_KEY);

        this.stiggClient = Stigg.initialize({ apiKey: stiggApiKey });
        this.clientHost = configService.get(Env.CLIENT_HOST);
        this.stiggClient
          .waitForInitialization()
          .then(() => {
            this.logger.info("Successfully initialized Stigg provider");
          })
          .catch((reason) => {
            this.logger.error(
              "Failed to initialize Stigg. Disabling billing module",
              reason
            );
            this.stiggClient.close();
            this.billingEnabled = false;
          });
      } else {
        this.logger.info(
          "Billing is disabled. Skipping initialization for Stigg Provider."
        );
      }
    } catch (error) {
      this.logger.error(
        "Failed to initialize Stigg. Disabling billing module",
        error
      );
      this.billingEnabled = false;
    }
  }

  async getStiggClient(): Promise<Stigg | null> {
    try {
      if (this.isBillingEnabled) {
        return this.stiggClient;
      }
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  /**
   * Report usage for a specific feature.
   * @param workspaceId Workspace to report usage for.
   * @param feature Feature to report usage for.
   * @param value Value to be added / removed from the current usage. Default is 1.
   * @returns Report usage ack.
   */
  async reportUsage(
    workspaceId: string,
    feature: BillingFeature,
    value = 1
  ): Promise<ReportUsageAck> {
    try {
      if (this.isBillingEnabled) {
        return await this.stiggClient.reportUsage({
          customerId: workspaceId,
          featureId: feature,
          value: value,
          updateBehavior: UsageUpdateBehavior.Delta,
        });
      }
      return { measurementId: null };
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  /**
   * Set usage for a specific feature. Overwrites the current usage.
   * @param workspaceId Workspace to report usage for.
   * @param feature Feature to report usage for.
   * @param value Value to be set as the current usage.
   * @returns
   */
  async setUsage(
    workspaceId: string,
    feature: BillingFeature,
    value: number
  ): Promise<ReportUsageAck> {
    try {
      if (this.isBillingEnabled) {
        return await this.stiggClient.reportUsage({
          customerId: workspaceId,
          featureId: feature,
          value,
          updateBehavior: UsageUpdateBehavior.Set,
        });
      }
      return { measurementId: null };
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  async getMeteredEntitlement(
    workspaceId: string,
    feature: BillingFeature
  ): Promise<MeteredEntitlement> {
    try {
      if (this.isBillingEnabled) {
        const stiggClient = await this.getStiggClient();
        return await stiggClient.getMeteredEntitlement({
          customerId: workspaceId,
          featureId: feature,
        });
      }
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  async getNumericEntitlement(
    workspaceId: string,
    feature: BillingFeature
  ): Promise<NumericEntitlement> {
    try {
      if (this.isBillingEnabled) {
        const stiggClient = await this.getStiggClient();
        return await stiggClient.getNumericEntitlement({
          customerId: workspaceId,
          featureId: feature,
        });
      }
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  async getBooleanEntitlement(
    workspaceId: string,
    feature: BillingFeature
  ): Promise<BooleanEntitlement> {
    try {
      if (this.isBillingEnabled) {
        const stiggClient = await this.getStiggClient();
        return await stiggClient.getBooleanEntitlement({
          customerId: workspaceId,
          featureId: feature,
        });
      }
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  async provisionSubscription({
    workspaceId,
    planId,
    billingPeriod,
    intentionType,
    cancelUrl,
    successUrl,
    userId,
  }: ProvisionSubscriptionInput & {
    userId: string;
  }): Promise<ProvisionSubscriptionResult> {
    const stiggClient = await this.getStiggClient();
    const stiggResponse = await stiggClient.provisionSubscription({
      customerId: workspaceId,
      planId: planId,
      billingPeriod: billingPeriod,
      awaitPaymentConfirmation: true,
      checkoutOptions: {
        allowPromoCodes: true,
        cancelUrl: new URL(cancelUrl, this.clientHost).href,
        successUrl: new URL(successUrl, this.clientHost).href,
      },
      metadata: {
        userId: userId,
      },
    });
    await this.analytics.track({
      userId,
      properties: {
        workspaceId,
        $groups: { groupWorkspace: workspaceId },
      },
      event:
        intentionType === "DOWNGRADE_PLAN"
          ? EnumEventType.WorkspacePlanDowngradeRequest
          : EnumEventType.WorkspacePlanUpgradeRequest,
    });

    return {
      provisionStatus: stiggResponse.provisionStatus,
      checkoutUrl: stiggResponse.checkoutUrl,
    };
  }

  async getSubscription(workspaceId: string): Promise<Subscription | null> {
    try {
      if (this.billingEnabled) {
        const stiggClient = await this.getStiggClient();
        const [activeSub] = await stiggClient.getActiveSubscriptions({
          customerId: workspaceId,
        });

        const amplicationSub = {
          id: activeSub.id,
          status: this.mapSubscriptionStatus(activeSub.status),
          workspaceId: workspaceId,
          subscriptionPlan: this.mapSubscriptionPlan(
            activeSub.plan.id as BillingPlan
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        return amplicationSub;
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error(error.message, error);
      return null; //on any exception, use free plan
    }
  }

  async provisionCustomer(workspaceId: string): Promise<null> {
    if (this.isBillingEnabled) {
      await this.stiggClient.provisionCustomer({
        customerId: workspaceId,
        shouldSyncFree: false,
        subscriptionParams: this.defaultSubscriptionPlan,
      });
    }
    return;
  }

  async provisionPreviewCustomer(
    workspaceId: string,
    previewAccountType: EnumPreviewAccountType
  ): Promise<null> {
    if (!this.isBillingEnabled) {
      return;
    }

    await this.stiggClient.provisionCustomer({
      customerId: workspaceId,
      subscriptionParams: null,
    });

    await this.stiggClient.provisionSubscription({
      customerId: workspaceId,
      planId: this.mapPreviewAccountTypeToSubscriptionPlan(previewAccountType),
      skipTrial: true,
    });
  }

  async provisionNewSubscriptionForPreviewAccount(
    workspaceId: string
  ): Promise<null> {
    if (!this.isBillingEnabled) {
      return;
    }

    await this.stiggClient.provisionSubscription({
      customerId: workspaceId,
      planId: this.defaultSubscriptionPlan.planId,
      addons: this.defaultSubscriptionPlan.addons,
    });
  }

  //todo: wrap with a try catch and return an object with the details about the limitations
  async validateSubscriptionPlanLimitationsForWorkspace({
    workspaceId,
    currentUser,
    repositories,
    bypassLimitations = false,
  }: ValidateSubscriptionPlanLimitationsArgs): Promise<void> {
    if (this.isBillingEnabled) {
      const isIgnoreValidationCodeGeneration = await this.getBooleanEntitlement(
        workspaceId,
        BillingFeature.IgnoreValidationCodeGeneration
      );
      //check whether the workspace has entitlement to bypass code generation limitation
      if (bypassLimitations || isIgnoreValidationCodeGeneration.hasAccess) {
        return;
      }

      try {
        const servicesEntitlement = await this.getMeteredEntitlement(
          workspaceId,
          BillingFeature.Services
        );

        if (!servicesEntitlement.hasAccess) {
          const message = `Your workspace exceeds its resource limitation.`;
          throw new BillingLimitationError(message, BillingFeature.Services);
        }

        const membersEntitlement = await this.getMeteredEntitlement(
          workspaceId,
          BillingFeature.TeamMembers
        );

        if (!membersEntitlement.hasAccess) {
          const message = `Your workspace exceeds its team member limitation.`;
          throw new BillingLimitationError(message, BillingFeature.TeamMembers);
        }

        const enterpriseGitProviders = Object.keys(EnumGitProvider).filter(
          (x) => x !== EnumGitProvider.Github
        );

        for (const enterpriseGitProvider of enterpriseGitProviders) {
          if (!BillingFeature[enterpriseGitProvider]) {
            throw new Error(
              `Unknown BillingFeature for git provider: ${enterpriseGitProvider}`
            );
          }

          const enterpriseGitEntitlement = await this.getBooleanEntitlement(
            workspaceId,
            BillingFeature[enterpriseGitProvider]
          );
          const provider = repositories?.find(
            (repo) => repo.gitOrganization.provider === enterpriseGitProvider
          )?.gitOrganization.provider;

          if (provider && !enterpriseGitEntitlement.hasAccess) {
            const message = `Your workspace uses ${enterpriseGitProvider} integration, while it is not part of your current plan.`;
            throw new BillingLimitationError(
              message,
              BillingFeature[enterpriseGitProvider]
            );
          }
        }

        const changeGitBaseBranchEntitlement = await this.getBooleanEntitlement(
          workspaceId,
          BillingFeature.ChangeGitBaseBranch
        );
        const projectWithCustomBaseBranch = repositories?.find(
          (repo) => repo.baseBranchName
        );
        if (
          projectWithCustomBaseBranch &&
          !changeGitBaseBranchEntitlement.hasAccess
        ) {
          const message = `Your workspace uses the custom git base branch feature, while it is not part of your current plan.`;
          throw new BillingLimitationError(
            message,
            BillingFeature.ChangeGitBaseBranch
          );
        }
      } catch (error) {
        if (error instanceof BillingLimitationError) {
          await this.analytics.track({
            userId: currentUser.account.id,
            properties: {
              workspaceId,
              reason: error.message,
              $groups: { groupWorkspace: workspaceId },
            },
            event: EnumEventType.SubscriptionLimitPassed,
          });
        }
        throw error;
      }
    }
  }

  async resetUsage(workspaceId: string, currentUsage: FeatureUsageReport) {
    if (this.isBillingEnabled) {
      await Promise.all([
        this.setUsage(
          workspaceId,
          BillingFeature.Projects,
          currentUsage.projects
        ),
        this.setUsage(
          workspaceId,
          BillingFeature.Services,
          currentUsage.services
        ),
        this.setUsage(
          workspaceId,
          BillingFeature.ServicesAboveEntitiesPerServiceLimit,
          currentUsage.servicesAboveEntityPerServiceLimit
        ),
        this.setUsage(
          workspaceId,
          BillingFeature.TeamMembers,
          currentUsage.teamMembers
        ),
      ]);
    }
  }

  mapSubscriptionStatus(status: SubscriptionStatus): EnumSubscriptionStatus {
    switch (status) {
      case SubscriptionStatus.Active:
        return EnumSubscriptionStatus.Active;
      case SubscriptionStatus.Canceled:
        return EnumSubscriptionStatus.Deleted;
      case SubscriptionStatus.Expired:
        return EnumSubscriptionStatus.PastDue;
      case SubscriptionStatus.InTrial:
        return EnumSubscriptionStatus.Trailing;
      case SubscriptionStatus.NotStarted:
        return EnumSubscriptionStatus.Paused;
      case SubscriptionStatus.PaymentPending:
        return EnumSubscriptionStatus.Paused;
      default:
        throw new Error(`Unknown subscription status: ${status}`);
    }
  }

  mapSubscriptionPlan(planId: BillingPlan): EnumSubscriptionPlan {
    switch (planId) {
      case BillingPlan.Free:
        return EnumSubscriptionPlan.Free;
      case BillingPlan.Pro:
        return EnumSubscriptionPlan.Pro;
      case BillingPlan.ProWithTrial:
        return EnumSubscriptionPlan.Pro;
      case BillingPlan.Enterprise:
        return EnumSubscriptionPlan.Enterprise;
      case BillingPlan.PreviewBreakTheMonolith:
        return EnumSubscriptionPlan.PreviewBreakTheMonolith;
      default:
        throw new Error(`Unknown plan id: ${planId}`);
    }
  }

  mapPreviewAccountTypeToSubscriptionPlan(
    previewAccountType: EnumPreviewAccountType
  ): BillingPlan {
    switch (previewAccountType) {
      case EnumPreviewAccountType.BreakingTheMonolith:
        return BillingPlan.PreviewBreakTheMonolith;
      case EnumPreviewAccountType.None:
        throw new Error(`${previewAccountType} is not a preview account type`);
      default:
        throw new Error(`Unknown preview account type: ${previewAccountType}`);
    }
  }
}
