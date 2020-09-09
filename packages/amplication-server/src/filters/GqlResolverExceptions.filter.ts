// This exception filter should be used for every resolver
// e.g:
// @UseFilters(GqlResolverExceptionsFilter)
// export class AuthResolver {
// It logs the exception with context information like IP, Host, UserId
// It uses Winston directly to log the error

import { Catch, ArgumentsHost, Inject } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaClientKnownRequestError } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import { AmplicationError } from '../errors/AmplicationError';

@Catch()
export class GqlResolverExceptionsFilter implements GqlExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const requestData = this.prepareRequestData(
      GqlArgumentsHost.create(host).getContext().req
    );
    let clientError;
    if (exception instanceof PrismaClientKnownRequestError) {
      /**Convert PrismaError to ApolloError and pass the error to the client */
      let message;
      switch (exception.code) {
        /**This is an example of a specific prisma error code */
        /**@todo: Complete the list or expected error codes */
        case 'P2002':
          const fields = ((exception.meta as any).target as Array<string>).join(
            ', '
          );
          message = `Another record with the same key already exist (${fields})`;
          break;

        default:
          message = exception.message;
          break;
      }

      clientError = new ApolloError(message);
      this.logger.error(clientError.message, { requestData });
    } else if (exception instanceof AmplicationError) {
      /**Convert AmplicationError to ApolloError and pass the error to the client */
      clientError = new ApolloError(exception.message);
      this.logger.error(clientError.message, { requestData });
    } else {
      //log the original exception and return a generic server error to client
      this.logger.error(exception.message, { requestData });
      clientError = new ApolloError('server error');
    }

    return clientError;
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
