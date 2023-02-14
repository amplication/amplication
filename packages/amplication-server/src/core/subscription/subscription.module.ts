import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { PaddleService } from "./paddle.service";
import { SubscriptionService } from "./subscription.service";
import { PermissionsModule } from "../permissions/permissions.module";
import { GoogleSecretsManagerModule } from "../../services/googleSecretsManager.module";
import { PaddleController } from "./paddle.controller";
import { SubscriptionController } from "./subscription.controller";
import { BillingModule } from "../billing/billing.module";
@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PermissionsModule,
    GoogleSecretsManagerModule,
    BillingModule,
  ],
  providers: [PaddleService, SubscriptionService],
  controllers: [PaddleController, SubscriptionController],
  exports: [PaddleService, SubscriptionService],
})
export class SubscriptionModule {}
