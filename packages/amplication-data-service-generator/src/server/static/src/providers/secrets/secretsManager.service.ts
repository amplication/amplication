import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SecretsManagerServiceBase } from "./base/secretsManager.service.base";

@Injectable()
export class SecretsManagerService extends SecretsManagerServiceBase {
  constructor(protected readonly configService: ConfigService) {
    super(configService);
  }
}
