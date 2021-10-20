import { JWT_SECRET_KEY } from "../../constants";
import { SecretsManagerService } from "../../providers/secrets/secretsManager.service";

export const JwtSecretFactory = {
  provide: JWT_SECRET_KEY,
  useFactory: async (secretsService: SecretsManagerService) => {
    return await secretsService.getSecret<string>(JWT_SECRET_KEY);
  },
  inject: [SecretsManagerService],
};
