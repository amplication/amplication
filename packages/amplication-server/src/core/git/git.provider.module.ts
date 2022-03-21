import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { AppModule } from '../app/app.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { GitResolver } from './git.resolver';
import { GitModule, GitService } from '@amplication/git-service';
import { GitProviderService } from './git.provider.service';
import { GitServiceFactory } from '@amplication/git-service/dist/utils/GitServiceFactory';
import { GithubService } from '@amplication/git-service/dist/providers/github.service';

@Module({
  imports: [PermissionsModule, AppModule, PrismaModule, GitModule],
  providers: [
    GitProviderService,
    GitResolver,
    GitService,
    GithubService,
    GitServiceFactory
  ],
  exports: [GitService]
})
export class GitProviderModule {}
