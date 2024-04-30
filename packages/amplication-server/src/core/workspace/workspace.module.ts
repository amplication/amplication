import { Module } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { WorkspaceResolver } from "./workspace.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import { AccountModule } from "../account/account.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { MailModule } from "../mail/mail.module";
import { UserModule } from "../user/user.module";
import { SubscriptionModule } from "../subscription/subscription.module";
import { ProjectModule } from "../project/project.module";
import { BillingModule } from "../billing/billing.module";
import { ModuleModule } from "../module/module.module";
import { ModuleActionModule } from "../moduleAction/moduleAction.module";
import { WorkspaceController } from "./workspace.controller";
import { ResourceModule } from "../resource/resource.module";
import { ModuleDtoModule } from "../moduleDto/moduleDto.module";

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    PermissionsModule,
    MailModule,
    UserModule,
    ProjectModule,
    ResourceModule,
    SubscriptionModule,
    BillingModule,
    ModuleModule,
    ModuleActionModule,
    ModuleDtoModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceResolver],
  exports: [WorkspaceService, WorkspaceResolver],
})
export class WorkspaceModule {}
