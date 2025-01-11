import { Module, forwardRef } from "@nestjs/common";
import { BillingService } from "./billing.service";
import { SegmentAnalyticsModule } from "../../services/segmentAnalytics/segmentAnalytics.module";

@Module({
  imports: [forwardRef(() => SegmentAnalyticsModule)],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
