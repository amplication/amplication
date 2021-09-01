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
import { JwtStrategy } from "./jwt/jwt.strategy";
import { SecretsManagerModule } from "../providers/secrets/secretsManager.module";
import { SecretsManagerService } from "../providers/secrets/secretsManager.service";
import { ConfigService } from "@nestjs/config";

export const JWT_SECRET_KEY = "JWT_SECRET_KEY";
export const JWT_EXPIRATION = "JWT_EXPIRATION";
@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    SecretsManagerModule,
    JwtModule.registerAsync({
      imports: [SecretsManagerModule],
      useFactory: async (
        secretsService: SecretsManagerService,
        configService: ConfigService
      ) => ({
        secret: secretsService.getSecret<string>(JWT_SECRET_KEY),
        signOptions: { expiresIn: configService.get(JWT_EXPIRATION) },
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
