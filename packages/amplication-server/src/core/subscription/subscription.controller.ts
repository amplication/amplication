import { Body, Controller, Post } from "@nestjs/common";
import { BillingService } from "../billing/billing.service";
import { CreateSubscriptionInput } from "./dto/CreateSubscriptionInput";
import { SubscriptionData } from "./dto/SubscriptionData";
import { UpdateStatusDto } from "./dto/UpdateStatusDto";
import { UpdateSubscriptionInput } from "./dto/UpdateSubscriptionInput";
import { SubscriptionService } from "./subscription.service";

@Controller("subscriptions")
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly billingService: BillingService
  ) {}

  @Post("updateStatus")
  async updateStatus(@Body() updateStatusDto: UpdateStatusDto): Promise<void> {
    switch (updateStatusDto.type) {
      case "subscription.created": {
        const createSubscriptionInput =
          this.mapUpdateStatusDtoToCreateSubscriptionInput(updateStatusDto);
        await this.subscriptionService.create(
          updateStatusDto.id,
          createSubscriptionInput
        );
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
