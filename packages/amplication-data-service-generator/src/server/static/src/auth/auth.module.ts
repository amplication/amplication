import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { SecretsManagerModule } from "../providers/secrets/secretsManager.module";
import { SecretsManagerService } from "../providers/secrets/secretsManager.service";
// @ts-ignore
// eslint-disable-next-line
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { BasicStrategy } from "./basic.strategy";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { PasswordService } from "./password.service";
@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    SecretsManagerModule,
    JwtModule.registerAsync({
      imports: [SecretsManagerModule],
      useFactory: async (secretsService: SecretsManagerService) => ({
        secret: secretsService.getSecret<string>(
          secretsService.constants.JWT_SECRET
        ),
        signOptions: { expiresIn: "2d" },
      }),
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
