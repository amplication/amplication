import { ConfigService } from "@nestjs/config";
import { EnumSecretsNameKey } from "../secretsNameKey.enum";

export interface ISecretsManager {
  getSecret: (key: EnumSecretsNameKey) => Promise<any | null>;
}

export class SecretsManagerServiceBase implements ISecretsManager {
  constructor(protected readonly configService: ConfigService) {}
  async getSecret<T>(key: EnumSecretsNameKey): Promise<T | null> {
    if (!key) {
      throw new Error("Didn't got the key");
    }
    const value = this.configService.get(key.toString());
    if (value) {
      return value;
    }
    return null;
  }
}
