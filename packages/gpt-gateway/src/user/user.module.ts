import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { UserModuleBase } from "./base/user.module.base";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";

@Module({
  imports: [UserModuleBase, forwardRef(() => AuthModule)],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
