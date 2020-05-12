// This excpetion filter should be used for every resolver
// e.g:
// @UseFilters(GqlResolverExceptionsFilter)
// export class AuthResolver {
// It logs the exception with context information like IP, Host, UserId
// It uses Winston directly to log the error

import { Catch, ArgumentsHost, Inject } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { Logger } from 'winston';

@Catch()
export class GqlResolverExceptionsFilter implements GqlExceptionFilter {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  catch(exception: string, host: ArgumentsHost) {
    const requestData = this.prepareRequestData(
      GqlArgumentsHost.create(host).getContext().req
    );
    this.logger.error(exception, { requestData });
    return exception;
  }

  prepareRequestData(req: any) {
    if (!req) return null;

    const query = req && req.body && req.body.query;
    const hostname = req.hostname;
    const ip = req.ip;
    const userId = req.user && req.user.id;

    return {
      query,
      hostname,
      ip,
      userId
    };
  }
}
