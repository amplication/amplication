import { Body, Controller, Post, Headers } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import {
  EnumEventType,
  SegmentAnalyticsService,
} from "../../services/segmentAnalytics/segmentAnalytics.service";
import { BillingService } from "../billing/billing.service";
import { EnumSubscriptionPlan } from "./dto";
import { CreateSubscriptionInput } from "./dto/CreateSubscriptionInput";
import { SubscriptionData } from "./dto/SubscriptionData";
import { UpdateStatusDto } from "./dto/UpdateStatusDto";
import { UpdateSubscriptionInput } from "./dto/UpdateSubscriptionInput";
import { SubscriptionService } from "./subscription.service";

@Controller("subscriptions")
export class SubscriptionController {
  private readonly stiggWebhooksSecret: string;

  constructor(
    private readonly analyticsService: SegmentAnalyticsService,
    private readonly subscriptionService: SubscriptionService,
    private readonly billingService: BillingService,
    private readonly configService: ConfigService
  ) {
    this.stiggWebhooksSecret = this.configService.get(
      Env.STIGG_WEBHOOKS_SECRET
    );
  }

  @Post("updateStatus")
  async updateStatus(
    @Headers("stigg-webhooks-secret") stiggWebhooksSecret,
    @Body() updateStatusDto: UpdateStatusDto
  ): Promise<void> {
    if (stiggWebhooksSecret !== this.stiggWebhooksSecret) {
      throw new Error("Invalid stigg-webhooks-secret");
    }

    switch (updateStatusDto.type) {
      case "subscription.created": {
        const createSubscriptionInput =
          this.mapUpdateStatusDtoToCreateSubscriptionInput(updateStatusDto);
        await this.subscriptionService.create(
          updateStatusDto.id,
          createSubscriptionInput
        );
        const userId = updateStatusDto.metadata?.userId;
        if (
          createSubscriptionInput.plan !== EnumSubscriptionPlan.Free &&
          userId
        ) {
          await this.analyticsService.track({
            userId: userId,
            properties: {
              workspaceId: updateStatusDto.customer.id,
            },
            event: EnumEventType.WorkspacePlanUpgradeCompleted,
          });
        }
        break;
      }
      case "subscription.updated":
      case "subscription.expired":
      case "subscription.canceled": {
        const updateSubscriptionInput =
          this.mapUpdateStatusDtoToUpdateSubscriptionInput(updateStatusDto);
        await this.subscriptionService.update(
          updateStatusDto.id,
          updateSubscriptionInput
        );
        break;
      }
    }
  }

  mapUpdateStatusDtoToCreateSubscriptionInput(
    updateStatusDto: UpdateStatusDto
  ): CreateSubscriptionInput {
    return {
      workspaceId: updateStatusDto.customer.id,
      status: this.billingService.mapSubscriptionStatus(updateStatusDto.status),
      plan: this.billingService.mapSubscriptionPlan(updateStatusDto.plan.id),
      subscriptionData: new SubscriptionData(),
    };
  }

  mapUpdateStatusDtoToUpdateSubscriptionInput(
    updateStatusDto: UpdateStatusDto
  ): UpdateSubscriptionInput {
    return {
      workspaceId: updateStatusDto.customer.id,
      status: this.billingService.mapSubscriptionStatus(updateStatusDto.status),
      plan: this.billingService.mapSubscriptionPlan(updateStatusDto.plan.id),
      subscriptionData: new SubscriptionData(),
    };
  }
}
