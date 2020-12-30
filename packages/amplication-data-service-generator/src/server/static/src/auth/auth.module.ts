import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
// @ts-ignore
// eslint-disable-next-line
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { BasicStrategy } from "./basic.strategy";
import { PasswordService } from "./password.service";

@Module({
  imports: [forwardRef(() => UserModule), PassportModule],
  providers: [AuthService, BasicStrategy, PasswordService, AuthResolver],
  controllers: [AuthController],
  exports: [AuthService, PasswordService],
})
export class AuthModule {}
