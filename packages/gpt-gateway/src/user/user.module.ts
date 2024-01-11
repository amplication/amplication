import { AuthModule } from "../auth/auth.module";
import { UserModuleBase } from "./base/user.module.base";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { Module, forwardRef } from "@nestjs/common";

@Module({
  imports: [UserModuleBase, forwardRef(() => AuthModule)],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
