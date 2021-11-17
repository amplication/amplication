import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { GoogleSecretsManagerModule } from 'src/services/googleSecretsManager.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { GithubService } from './github.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PermissionsModule,
    GoogleSecretsManagerModule
  ],
  providers: [GithubService],
  exports: [GithubService]
})
export class GithubModule {}
