import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RootWinstonModule } from 'src/services/root-winston.module';
import { GqlResolverExceptionsFilter } from './GqlResolverExceptions.filter';
import { GithubAuthExceptionFilter } from './github-auth-exception.filter';

@Module({
  imports: [ConfigModule, RootWinstonModule],
  providers: [GqlResolverExceptionsFilter, GithubAuthExceptionFilter],
  exports: [GqlResolverExceptionsFilter, GithubAuthExceptionFilter]
})
export class ExceptionFiltersModule {}
