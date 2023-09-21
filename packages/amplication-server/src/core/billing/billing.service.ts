import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stigg, {
  BooleanEntitlement,
  MeteredEntitlement,
  NumericEntitlement,
  ReportUsageAck,
  SubscriptionStatus,
} from "@stigg/node-server-sdk";
import { Env } from "../../env";
import { EnumSubscriptionPlan } from "../subscription/dto";
import { EnumSubscriptionStatus } from "../subscription/dto/EnumSubscriptionStatus";
import { Subscription } from "../subscription/dto/Subscription";
import { BillingFeature, BillingPlan } from "./billing.types";
import {
  EnumEventType,
  SegmentAnalyticsService,
} from "../../services/segmentAnalytics/segmentAnalytics.service";
import { ProvisionSubscriptionResult } from "../workspace/dto/ProvisionSubscriptionResult";
import { ValidationError } from "../../errors/ValidationError";
import { FeatureUsageReport } from "../project/FeatureUsageReport";
import { ProvisionSubscriptionInput } from "../workspace/dto/ProvisionSubscriptionInput";
import { User } from "../../models";

@Injectable()
export class BillingService {
  private readonly stiggClient: Stigg;
  private readonly clientHost: string;
  private billingEnabled: boolean;

  get isBillingEnabled(): boolean {
    return this.billingEnabled;
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

  async reportUsage(
    workspaceId: string,
    feature: BillingFeature,
    value = 1
  ): Promise<ReportUsageAck> {
    try {
      if (this.isBillingEnabled) {
        const stiggClient = await this.getStiggClient();
        return await stiggClient.reportUsage({
          customerId: workspaceId,
          featureId: feature,
          value: value,
        });
      }
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  async setUsage(
    workspaceId: string,
    feature: BillingFeature,
    value: number
  ): Promise<ReportUsageAck> {
    try {
      if (this.isBillingEnabled) {
        const stiggClient = await this.getStiggClient();

        const entitlement = await stiggClient.getMeteredEntitlement({
          customerId: workspaceId,
          featureId: feature,
        });

        const result = value - entitlement.currentUsage;

        return await stiggClient.reportUsage({
          customerId: workspaceId,
          featureId: feature,
          value: result,
        });
      }
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
        cancelUrl: new URL(successUrl, this.clientHost).href,
        successUrl: new URL(cancelUrl, this.clientHost).href,
      },
      metadata: {
        userId: userId,
      },
    });
    await this.analytics.track({
      userId,
      properties: {
        workspaceId,
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
        const workspace = await stiggClient.getCustomer(workspaceId);

        const activeSub = await workspace.subscriptions.find((subscription) => {
          return subscription.status === SubscriptionStatus.Active;
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

  async provisionCustomer(
    workspaceId: string,
    plan: BillingPlan
  ): Promise<null> {
    if (this.isBillingEnabled) {
      const stiggClient = await this.getStiggClient();
      await stiggClient.provisionCustomer({
        customerId: workspaceId,
        shouldSyncFree: false,
        subscriptionParams: {
          planId: plan,
        },
      });
    }
    return;
  }

  //todo: wrap with a try catch and return an object with the details about the limitations
  async validateSubscriptionPlanLimitationsForWorkspace(
    workspaceId: string,
    currentUser: User
  ): Promise<void> {
    if (this.isBillingEnabled) {
      const isIgnoreValidationCodeGeneration = await this.getBooleanEntitlement(
        workspaceId,
        BillingFeature.IgnoreValidationCodeGeneration
      );

      //check whether the workspace has entitlement to bypass code generation limitation
      if (!isIgnoreValidationCodeGeneration.hasAccess) {
        const servicesEntitlement = await this.getMeteredEntitlement(
          workspaceId,
          BillingFeature.Services
        );

        if (!servicesEntitlement.hasAccess) {
          const message = `Allowed services per workspace: ${servicesEntitlement.usageLimit}`;

          await this.analytics.track({
            userId: currentUser.account.id,
            properties: {
              workspaceId,
              reason: message,
            },
            event: EnumEventType.SubscriptionLimitPassed,
          });

          throw new ValidationError(`LimitationError: ${message}`);
        }

        const servicesAboveEntitiesPerServiceLimitEntitlement =
          await this.getMeteredEntitlement(
            workspaceId,
            BillingFeature.ServicesAboveEntitiesPerServiceLimit
          );

        if (!servicesAboveEntitiesPerServiceLimitEntitlement.hasAccess) {
          const entitiesPerServiceEntitlement =
            await this.getNumericEntitlement(
              workspaceId,
              BillingFeature.EntitiesPerService
            );

          const entitiesPerServiceLimit = entitiesPerServiceEntitlement.value;
          const message = `Allowed entities per service: ${entitiesPerServiceLimit}`;

          await this.analytics.track({
            userId: currentUser.account.id,
            properties: {
              workspaceId,
              reason: message,
            },
            event: EnumEventType.SubscriptionLimitPassed,
          });

          throw new ValidationError(`LimitationError: ${message}`);
        }
      }
    }
  }

  async resetUsage(workspaceId: string, currentUsage: FeatureUsageReport) {
    if (this.isBillingEnabled) {
      await this.setUsage(
        workspaceId,
        BillingFeature.Services,
        currentUsage.services
      );

      await this.setUsage(
        workspaceId,
        BillingFeature.ServicesAboveEntitiesPerServiceLimit,
        currentUsage.servicesAboveEntityPerServiceLimit
      );
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
      default:
        throw new Error(`Unknown plan id: ${planId}`);
    }
  }
}
