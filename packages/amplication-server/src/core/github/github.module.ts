import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
import { GithubService } from './github.service';
import { PermissionsModule } from '../permissions/permissions.module';
import { GoogleSecretsManagerModule } from 'src/services/googleSecretsManager.module';

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
