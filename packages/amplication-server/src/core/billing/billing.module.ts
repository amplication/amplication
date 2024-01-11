import { BillingService } from "./billing.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
