import { Body, Controller, Post } from "@nestjs/common";
import { UserEntity } from "../../decorators/user.decorator";
import { User } from "../../models";
import { BillingService } from "./billing.service";
import { ProvisionSubscriptionDto } from "./ProvisionSubscriptionDto";

@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post("/provisionSubscription")
  async provisionSubscription(
    @Body() provisionSubscriptionDto: ProvisionSubscriptionDto,
    @UserEntity() currentUser: User
  ) {
    console.log("currentUser", currentUser);
    const checkoutResult = await this.billingService.provisionSubscription(
      provisionSubscriptionDto.workspaceId,
      provisionSubscriptionDto.planId,
      provisionSubscriptionDto.billingPeriod,
      provisionSubscriptionDto.intentionType,
      provisionSubscriptionDto.cancelUrl,
      provisionSubscriptionDto.successUrl,
      currentUser.id
    );

    return checkoutResult;
  }
}
