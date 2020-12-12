import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
// @ts-ignore
// eslint-disable-next-line
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { BasicStrategy } from "./basic.strategy";
import { PasswordService } from "./password.service";

@Module({
  imports: [forwardRef(() => UserModule), PassportModule],
  providers: [AuthService, BasicStrategy],
  exports: [AuthService, PasswordService],
})
export class AuthModule {}
