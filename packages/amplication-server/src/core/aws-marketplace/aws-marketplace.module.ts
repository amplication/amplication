import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { AwsMarketplaceController } from "./aws-marketplace.controller";
import { AuthModule } from "../auth/auth.module";
import { AwsMarketplaceService } from "./aws-marketplace.service";

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [AwsMarketplaceService],
  controllers: [AwsMarketplaceController],
  exports: [],
})
export class AwsMarketplaceModule {}
