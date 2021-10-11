import { ConfigService } from "@nestjs/config";
import { ISecretsManager } from "../secretsManager.interface";

export class SecretsManagerServiceBase implements ISecretsManager {
  constructor(protected readonly configService: ConfigService) {}
  getSecret<T>(key: string): T | null {
    const value = this.configService.get(key);
    if (value) {
      return value;
    }
    return null;
  }
}
