import { PrismaModule } from "../../prisma/prisma.module";
import { SegmentAnalyticsModule } from "../../services/segmentAnalytics/segmentAnalytics.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { AccountResolver } from "./account.resolver";
import { AccountService } from "./account.service";
import { PasswordService } from "./password.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    PermissionsModule,
    SegmentAnalyticsModule,
  ],
  providers: [AccountService, PasswordService, AccountResolver],
  exports: [AccountService, PasswordService, AccountResolver],
})
export class AccountModule {}
