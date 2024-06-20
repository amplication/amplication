import { Module, forwardRef } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { AwsMarketplaceController } from "./aws-marketplace.controller";
import { AuthModule } from "../auth/auth.module";
import { AwsMarketplaceService } from "./aws-marketplace.service";
import { BillingModule } from "../billing/billing.module";

@Module({
  imports: [forwardRef(() => AuthModule), BillingModule, PrismaModule],
  providers: [AwsMarketplaceService],
  controllers: [AwsMarketplaceController],
  exports: [AwsMarketplaceService],
})
export class AwsMarketplaceModule {}
