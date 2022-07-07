import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from '@amplication/prisma-db';
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
    PrismaService,
    GitServiceFactory
  ]
})
export class GitProviderModule {}
