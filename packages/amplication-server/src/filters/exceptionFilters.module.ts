import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GqlResolverExceptionsFilter } from "./GqlResolverExceptions.filter";
import { GithubAuthExceptionFilter } from "./github-auth-exception.filter";

@Module({
  imports: [ConfigModule],
  providers: [GqlResolverExceptionsFilter, GithubAuthExceptionFilter],
  exports: [GqlResolverExceptionsFilter, GithubAuthExceptionFilter],
})
export class ExceptionFiltersModule {}
