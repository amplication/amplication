import { ConfigService } from "@nestjs/config";

export interface ISecretsManager {
  getSecret: (key: string) => Promise<any | null>;
}

export class SecretsManagerServiceBase implements ISecretsManager {
  constructor(protected readonly configService: ConfigService) {}
  async getSecret<T>(key: string): Promise<T | null> {
    const value = this.configService.get(key);
    if (value) {
      return value;
    }
    return null;
  }
}
