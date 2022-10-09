import { AmplicationLoggerModule } from '@amplication/nest-logger-module';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GitService } from './services/git.service';
import { GitServiceFactory } from './utils/GitServiceFactory';
import { GithubService } from './providers/github.service';
import { SERVICE_NAME } from './utils/constants';

@Global()
@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env']
    }),
    AmplicationLoggerModule.register({
      metadata: { service: SERVICE_NAME }
    })
  ],
  providers: [GitService, GithubService, GitServiceFactory],
  exports: [GitService, GitServiceFactory, GithubService]
})
export class GitModule {}
