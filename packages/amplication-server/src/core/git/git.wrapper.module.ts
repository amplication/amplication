import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { AppModule } from '../app/app.module';
import { GithubModule } from '../github/github.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { GitResolver } from './git.resolver';
import { GitWrapperService } from './git.wrapper.service';
import { GitModule } from '@amplication/git-service';
import { GitService } from '@amplication/git-service/src/services/git.service';
import { GitServiceFactory } from '@amplication/git-service/src/utils/GitServiceFactory';
import { GithubService } from '@amplication/git-service/src/providers/github.service';

@Module({
  imports: [
    PermissionsModule,
    GithubModule,
    AppModule,
    PrismaModule,
    GitModule
  ],
  providers: [
    GitWrapperService,
    GithubService,
    GitResolver,
    GitServiceFactory,
    GitService
  ]
})
export class GitWrapperModule {}
