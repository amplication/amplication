import { Module } from '@nestjs/common';
import { GoogleSecretsManagerService } from './googleSecretsManager.service';

@Module({
  providers: [GoogleSecretsManagerService],
  exports: [GoogleSecretsManagerService]
})
export class GoogleSecretsManagerModule {}
