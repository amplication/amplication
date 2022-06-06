import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JWT_EXPIRATION, JWT_SECRET_KEY } from "src/constants";
import { SecretsManagerModule } from "src/providers/secrets/secretsManager.module";
import { SecretsManagerService } from "src/providers/secrets/secretsManager.service";
import { QueueModule } from "src/queue/queue.module";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { jwtSecretFactory } from "./jwt/jwtSecretFactory";

@Module({
  imports: [
    QueueModule,
    SecretsManagerModule,
    JwtModule.registerAsync({
      imports: [SecretsManagerModule],
      inject: [SecretsManagerService, ConfigService],
      useFactory: async (
        secretsService: SecretsManagerService,
        configService: ConfigService
      ) => {
        const secret = await secretsService.getSecret<string>(JWT_SECRET_KEY);
        const expiresIn = configService.get(JWT_EXPIRATION);
        if (!secret) {
          throw new Error("Didn't get a valid jwt secret");
        }
        if (!expiresIn) {
          throw new Error("Jwt expire in value is not valid");
        }
        return {
          secret: secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  providers: [JwtStrategy, jwtSecretFactory],
})
export class AuthModule {}
