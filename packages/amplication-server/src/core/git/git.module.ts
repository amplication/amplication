import { Module } from '@nestjs/common';
import { AppModule } from '../app/app.module';
import { GithubModule } from '../github/github.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { GitResolver } from './git.resolver';
import { GitService } from './git.service';

@Module({
  imports: [PermissionsModule, GithubModule, AppModule],
  providers: [GitService, GitResolver]
})
export class GitModule {}
