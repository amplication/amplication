import { PrismaModule } from "../../prisma";
import { ActionModule } from "../action/action.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ResourceModule } from "../resource/resource.module";
import { UserModule } from "../user/user.module";
import { UserActionResolver } from "./userAction.resolver";
import { UserActionService } from "./userAction.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    ActionModule,
    ResourceModule,
    UserModule,
  ],
  providers: [UserActionResolver, UserActionService],
  exports: [UserActionResolver, UserActionService],
})
export class UserActionModule {}
