import { SecretsManagerServiceBase } from "./base/secretsManager.service.base";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SecretsManagerService extends SecretsManagerServiceBase {
  constructor(protected readonly configService: ConfigService) {
    super(configService);
  }
}
