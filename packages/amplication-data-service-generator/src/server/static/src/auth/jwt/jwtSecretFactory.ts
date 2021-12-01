import { JWT_SECRET_KEY } from "../../constants";
import { SecretsManagerService } from "../../providers/secrets/secretsManager.service";

export const jwtSecretFactory = {
  provide: JWT_SECRET_KEY,
  useFactory: async (
    secretsService: SecretsManagerService
  ): Promise<string> => {
    const secret = await secretsService.getSecret<string>(JWT_SECRET_KEY);
    if (secret) {
      return secret;
    }
    throw new Error("jwtSecretFactory missing secret");
  },
  inject: [SecretsManagerService],
};
