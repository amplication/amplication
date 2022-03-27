import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { AppModule } from '../app/app.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { GitResolver } from './git.resolver';
import {
  GitModule,
  GitService,
  GithubService,
  GitServiceFactory
} from '@amplication/git-service';
import { GitProviderService } from './git.provider.service';
@Module({
  imports: [PermissionsModule, AppModule, PrismaModule, GitModule],
  providers: [
    GitProviderService,
    GitResolver,
    GitService,
    GithubService,
    GitServiceFactory
  ]
})
export class GitProviderModule {}
