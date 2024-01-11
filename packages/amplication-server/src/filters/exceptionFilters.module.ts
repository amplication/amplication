import { GqlResolverExceptionsFilter } from "./GqlResolverExceptions.filter";
import { AuthExceptionFilter } from "./auth-exception.filter";
import { GithubAuthExceptionFilter } from "./github-auth-exception.filter";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

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
