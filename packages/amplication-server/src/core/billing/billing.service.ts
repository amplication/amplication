import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from "@amplication/nest-logger-module";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stigg, {
  BooleanEntitlement,
  MeteredEntitlement,
  NumericEntitlement,
  ReportUsageAck,
} from "@stigg/node-server-sdk";
import { SubscriptionStatus } from "@stigg/node-server-sdk/dist/api/generated/types";
import { Env } from "../../env";
import { EnumSubscriptionPlan, SubscriptionData } from "../subscription/dto";
import { EnumSubscriptionStatus } from "../subscription/dto/EnumSubscriptionStatus";
import { Subscription } from "../subscription/dto/Subscription";
import { BillingFeature } from "./BillingFeature";
import { BillingPlan } from "./BillingPlan";
import {
  EnumEventType,
  SegmentAnalyticsService,
} from "../../services/segmentAnalytics/segmentAnalytics.service";
import { ProvisionSubscriptionResult } from "../workspace/dto/ProvisionSubscriptionResult";
import { ValidationError } from "../../errors/ValidationError";
import { FeatureUsageReport } from "../project/FeatureUsageReport";
import { ProvisionSubscriptionInput } from "../workspace/dto/ProvisionSubscriptionInput";

@Injectable()
export class BillingService {
  private readonly stiggClient: Stigg;
  private readonly clientHost: string;
  private billingEnabled: boolean;

  get isBillingEnabled(): boolean {
    return this.billingEnabled;
  }

  constructor(
    @Inject(AMPLICATION_LOGGER_PROVIDER)
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
            this.logger.error("failed to initialize Stigg", { reason });
            this.logger.error("Disabling billing module");
            this.stiggClient.close();
            this.billingEnabled = false;
          });
      } else {
        this.logger.info(
          "Billing is disabled. Skipping initialization for Stigg Provider."
        );
      }
    } catch (error) {
      this.logger.error("failed to initialize Stigg", { error });
      this.logger.error("Disabling billing module");
      this.billingEnabled = false;
    }
  }

  async getStiggClient(): Promise<Stigg | null> {
    try {
      if (this.isBillingEnabled) {
        return this.stiggClient;
      }
      return null;
    } catch (err) {
      this.logger.error(err);
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
      this.logger.error(error);
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
      this.logger.error(error);
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
      this.logger.error(error);
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
      this.logger.error(error);
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
      this.logger.error(error);
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

        if (activeSub.plan.id === BillingPlan.Free) {
          return null;
        }

        const amplicationSub = {
          id: activeSub.id,
          status: this.mapSubscriptionStatus(activeSub.status),
          workspaceId: workspaceId,
          subscriptionPlan: this.mapSubscriptionPlan(
            activeSub.plan.id as BillingPlan
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
          subscriptionData: new SubscriptionData(),
        };

        return amplicationSub;
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error(error);
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
        subscriptionParams: {
          planId: plan,
        },
      });
    }
    return;
  }

  //todo: wrap with a try catch and return an object with the details about the limitations
  async validateSubscriptionPlanLimitationsForWorkspace(
    workspaceId: string
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
          throw new ValidationError(
            `LimitationError: Allowed services per workspace: ${servicesEntitlement.usageLimit}`
          );
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

          throw new ValidationError(
            `LimitationError: Allowed entities per service: ${entitiesPerServiceLimit}`
          );
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
      case BillingPlan.Pro:
        return EnumSubscriptionPlan.Pro;
      case BillingPlan.Enterprise:
        return EnumSubscriptionPlan.Enterprise;
      default:
        throw new Error(`Unknown plan id: ${planId}`);
    }
  }
}
