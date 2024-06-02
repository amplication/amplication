import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GqlResolverExceptionsFilter } from "./GqlResolverExceptions.filter";
import { GithubAuthExceptionFilter } from "./github-auth-exception.filter";
import { AuthExceptionFilter } from "./auth-exception.filter";

@Module({
  imports: [ConfigModule],
  providers: [
    GqlResolverExceptionsFilter,
    GithubAuthExceptionFilter,
    AuthExceptionFilter,
  ],
  exports: [
    GqlResolverExceptionsFilter,
    GithubAuthExceptionFilter,
    AuthExceptionFilter,
  ],
})
export class ExceptionFiltersModule {}
