import { Module, forwardRef } from "@nestjs/common";
import { UserActionResolver } from "./userAction.resolver";
import { UserActionService } from "./userAction.service";
import { PrismaModule } from "../../prisma";
import { PermissionsModule } from "../permissions/permissions.module";
import { ActionModule } from "../action/action.module";
import { ResourceModule } from "../resource/resource.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    ActionModule,
    forwardRef(() => ResourceModule),
    UserModule,
  ],
  providers: [UserActionResolver, UserActionService],
  exports: [UserActionResolver, UserActionService],
})
export class UserActionModule {}
