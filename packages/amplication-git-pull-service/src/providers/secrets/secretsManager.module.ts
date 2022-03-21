import { Module } from "@nestjs/common";
import { SecretsManagerService } from "./secretsManager.service";

@Module({
  providers: [SecretsManagerService],
  exports: [SecretsManagerService],
})
export class SecretsManagerModule {}
