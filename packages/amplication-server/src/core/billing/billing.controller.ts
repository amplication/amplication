import { Body, Controller, Post } from "@nestjs/common";
import { BillingService } from "./billing.service";
import { ProvisionSubscriptionDto } from "./ProvisionSubscriptionDto";

@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post("/provisionSubscription")
  async provisionSubscription(
    @Body() provisionSubscriptionDto: ProvisionSubscriptionDto
  ) {
    const checkoutResult = await this.billingService.provisionSubscription(
      provisionSubscriptionDto.workspaceId,
      provisionSubscriptionDto.planId,
      provisionSubscriptionDto.cancelUrl,
      provisionSubscriptionDto.successUrl
    );

    return checkoutResult;
  }
}
