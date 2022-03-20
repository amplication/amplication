import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { AppModule } from '../app/app.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { GitResolver } from './git.resolver';
import { GitModule } from '@amplication/git-service';
import { GitService } from '@amplication/git-service/src/services/git.service';
import { GitServiceFactory } from '@amplication/git-service/src/utils/GitServiceFactory';
import { GithubService } from '@amplication/git-service/src/providers/github.service';
import { GitProviderService } from './git.provider.service';

@Module({
  imports: [PermissionsModule, AppModule, PrismaModule, GitModule],
  providers: [
    GitProviderService,
    GithubService,
    GitResolver,
    GitServiceFactory,
    GitService
  ]
})
export class GitProviderModule {}
