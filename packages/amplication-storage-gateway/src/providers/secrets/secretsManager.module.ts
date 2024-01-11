import { SecretsManagerService } from "./secretsManager.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [SecretsManagerService],
  exports: [SecretsManagerService],
})
export class SecretsManagerModule {}
