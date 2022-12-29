import { Body, Controller, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { BillingService } from "./billing.service";
import { ProvisionSubscriptionDto } from "./ProvisionSubscriptionDto";

@Controller("billing")
export class BillingController {
  constructor(
    private readonly configService: ConfigService,
    private readonly billingService: BillingService
  ) {}

  @Post("/provisionSubscription")
  async provisionSubscription(
    @Body() provisionSubscriptionDto: ProvisionSubscriptionDto
  ) {
    const clientHost = this.configService.get(Env.CLIENT_HOST);
    const checkoutResult = await this.billingService.provisionSubscription(
      provisionSubscriptionDto.workspaceId,
      provisionSubscriptionDto.planId,
      clientHost,
      clientHost
    );

    return checkoutResult;
  }
}
