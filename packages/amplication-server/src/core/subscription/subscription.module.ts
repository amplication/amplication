import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { SubscriptionService } from "./subscription.service";
import { PermissionsModule } from "../permissions/permissions.module";
import { SubscriptionController } from "./subscription.controller";
import { BillingModule } from "../billing/billing.module";
@Module({
  imports: [PrismaModule, ConfigModule, PermissionsModule, BillingModule],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
