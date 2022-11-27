import { Module } from "@nestjs/common";
import { UserModuleBase } from "./base/user.module.base";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";

@Module({
  imports: [UserModuleBase],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
