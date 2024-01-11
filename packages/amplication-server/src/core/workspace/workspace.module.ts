import { PrismaModule } from "../../prisma/prisma.module";
import { AccountModule } from "../account/account.module";
import { BillingModule } from "../billing/billing.module";
import { MailModule } from "../mail/mail.module";
import { ModuleModule } from "../module/module.module";
import { ModuleActionModule } from "../moduleAction/moduleAction.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ProjectModule } from "../project/project.module";
import { SubscriptionModule } from "../subscription/subscription.module";
import { UserModule } from "../user/user.module";
import { WorkspaceController } from "./workspace.controller";
import { WorkspaceResolver } from "./workspace.resolver";
import { WorkspaceService } from "./workspace.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    PermissionsModule,
    MailModule,
    UserModule,
    ProjectModule,
    SubscriptionModule,
    BillingModule,
    ModuleModule,
    ModuleActionModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceResolver],
  exports: [WorkspaceService, WorkspaceResolver],
})
export class WorkspaceModule {}
