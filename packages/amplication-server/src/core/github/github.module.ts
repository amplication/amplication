import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { GoogleSecretsManagerModule } from 'src/services/googleSecretsManager.module';
import { AppModule } from '../app/app.module'; // eslint-disable-line import/no-cycle
import { PermissionsModule } from '../permissions/permissions.module';
import { GithubService } from './github.service';
import { GithubTokenExtractor } from './utils/tokenExtractor/githubTokenExtractor';

@Module({
  imports: [
    forwardRef(() => AppModule),
    PrismaModule,
    ConfigModule,
    PermissionsModule,
    GoogleSecretsManagerModule
  ],
  providers: [GithubService, GithubTokenExtractor],
  exports: [GithubService]
})
export class GithubModule {}
