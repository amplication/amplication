import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
// @ts-ignore
// eslint-disable-next-line
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { BasicStrategy } from "./basic.strategy";
import { PasswordService } from "./password.service";
import { jwtConstants } from "./jwt/constants";
import { JwtStrategy } from "./jwt/jwt.strategy";

// const JWT_SECRET = "JWT_SECRET";
@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      //TODO add connection to env file
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "2d" },
    }),
  ],
  providers: [
    AuthService,
    BasicStrategy,
    PasswordService,
    AuthResolver,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService, PasswordService],
})
export class AuthModule {}
