import { ConfigService } from '@nestjs/config';

export interface SecretsManager {
  getSecret: (key: string) => Promise<any | null>;
}

export class SecretsManagerService implements SecretsManager {
  constructor(protected readonly configService: ConfigService) {}
  async getSecret<T>(key: string): Promise<T | null> {
    if (!key) {
      throw new Error("Didn't get the key");
    }
    const value = this.configService.get(key);
    if (value) {
      return value;
    }
    return null;
  }
}
