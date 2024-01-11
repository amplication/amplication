import { PrismaModule } from "../../prisma/prisma.module";
import { BillingModule } from "../billing/billing.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionService } from "./subscription.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
@Module({
  imports: [PrismaModule, ConfigModule, PermissionsModule, BillingModule],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
