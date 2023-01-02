import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from "@amplication/nest-logger-module";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stigg, {
  BillingPeriod,
  BooleanEntitlement,
  MeteredEntitlement,
  NumericEntitlement,
  ProvisionSubscriptionResult,
  ReportUsageAck,
} from "@stigg/node-server-sdk";
import { SubscriptionStatus } from "@stigg/node-server-sdk/dist/api/generated/types";
import { Env } from "../../env";
import { EnumSubscriptionPlan, SubscriptionData } from "../subscription/dto";
import { EnumSubscriptionStatus } from "../subscription/dto/EnumSubscriptionStatus";
import { Subscription } from "../subscription/dto/Subscription";
import { BillingFeature } from "./BillingFeature";
import { BillingPlan } from "./BillingPlan";

@Injectable()
export class BillingService {
  private readonly stiggClient: Stigg;

  constructor(
    @Inject(AMPLICATION_LOGGER_PROVIDER)
    private readonly logger: AmplicationLogger,
    configService: ConfigService
  ) {
    const stiggApiKey = configService.get(Env.BILLING_API_KEY);
    this.stiggClient = Stigg.initialize({ apiKey: stiggApiKey });
  }

  async getStiggClient() {
    try {
      await this.stiggClient.waitForInitialization();
      return this.stiggClient;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async reportUsage(
    workspaceId: string,
    feature: BillingFeature,
    value = 1
  ): Promise<ReportUsageAck> {
    const stiggClient = await this.getStiggClient();
    return await stiggClient.reportUsage({
      customerId: workspaceId,
      featureId: feature,
      value: value,
    });
  }

  async getMeteredEntitlement(
    workspaceId: string,
    feature: BillingFeature
  ): Promise<MeteredEntitlement> {
    const stiggClient = await this.getStiggClient();
    return await stiggClient.getMeteredEntitlement({
      customerId: workspaceId,
      featureId: feature,
    });
  }

  async getNumericEntitlement(
    workspaceId: string,
    feature: BillingFeature
  ): Promise<NumericEntitlement> {
    const stiggClient = await this.getStiggClient();
    return await stiggClient.getNumericEntitlement({
      customerId: workspaceId,
      featureId: feature,
    });
  }

  async getBooleanEntitlement(
    workspaceId: string,
    feature: BillingFeature
  ): Promise<BooleanEntitlement> {
    const stiggClient = await this.getStiggClient();
    return await stiggClient.getBooleanEntitlement({
      customerId: workspaceId,
      featureId: feature,
    });
  }

  async provisionSubscription(
    workspaceId: string,
    planId: string,
    cancelUrl: string,
    successUrl: string
  ): Promise<ProvisionSubscriptionResult> {
    const stiggClient = await this.getStiggClient();
    return await stiggClient.provisionSubscription({
      customerId: workspaceId,
      planId: planId,
      billingPeriod: BillingPeriod.Monthly,
      awaitPaymentConfirmation: true,
      checkoutOptions: {
        allowPromoCodes: true,
        cancelUrl: cancelUrl,
        successUrl: successUrl,
      },
    });
  }

  async getSubscription(workspaceId: string): Promise<Subscription> {
    try {
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
    } catch (error) {
      return null; //on any exception, use free plan
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
