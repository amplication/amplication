import { Module } from '@nestjs/common';
import { AppModule } from '../app/app.module';
import { GithubModule } from '../github/github.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { GitResolver } from './git.resolver';
import { GitService } from './git.service';
import { GitServiceFactory } from './utils/GitServiceFactory/GitServiceFactory';

@Module({
  imports: [PermissionsModule, GithubModule, AppModule],
  providers: [GitService, GitResolver, GitServiceFactory]
})
export class GitModule {}
