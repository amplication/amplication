import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GitService } from './services/git.service';
import { GitServiceFactory } from './utils/GitServiceFactory';
import { GithubService } from './providers/github.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env']
    })
  ],
  providers: [GitService, GithubService, GitServiceFactory],
  exports: [GitService, GitServiceFactory, GithubService]
})
export class GitModule {}
