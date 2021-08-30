import { ConfigService } from "@nestjs/config";

export class SecretsManagerServiceBase {
  constructor(protected readonly configService: ConfigService) {}
  getSecret<T>(key: string): T {
    const value = this.configService.get(key);
    return value;
  }
}
