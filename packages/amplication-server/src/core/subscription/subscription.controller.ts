import { Body, Controller, Post, Headers } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { UpdateStatusDto } from "./dto/UpdateStatusDto";
import { SubscriptionService } from "./subscription.service";

@Controller("subscriptions")
export class SubscriptionController {
  private readonly stiggWebhooksSecret: string;

  constructor(
    private readonly subscriptionService: SubscriptionService,
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

    await this.subscriptionService.handleUpdateSubscriptionStatusEvent(
      updateStatusDto
    );
  }
}
