import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
// @ts-ignore
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { BasicStrategy } from "./basic.strategy";

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, BasicStrategy],
})
export class AuthModule {}
