// This exception filter should be used for every resolver
// e.g:
// @UseFilters(GqlResolverExceptionsFilter)
// export class AuthResolver {
// It logs the exception with context information like IP, Host, UserId
// It uses Winston directly to log the error

import { Catch, ArgumentsHost, Inject, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Prisma } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import { Request } from 'express';
import { AmplicationError } from '../errors/AmplicationError';

export type RequestData = {
  query: string;
  hostname: string;
  ip: string;
  userId: string;
};

export const PRISMA_CODE_UNIQUE_KEY_VIOLATION = 'P2002';

export class UniqueKeyException extends ApolloError {
  constructor(fields: string[]) {
    super(
      `Another record with the same key already exist (${fields.join(', ')})`
    );
  }
}

export class InternalServerError extends ApolloError {
  constructor() {
    super('Internal server error');
  }
}

export function createRequestData(req: Request): RequestData {
  const user = req.user as { id: string } | null;
  return {
    query: req.body?.query,
    hostname: req.hostname,
    ip: req.ip,
    userId: user?.id
  };
}

@Catch()
export class GqlResolverExceptionsFilter implements GqlExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: ConfigService
  ) {}

  catch(exception: Error, host: ArgumentsHost): Error {
    const requestData = this.prepareRequestData(host);
    let clientError: Error;
    /**@todo: Complete the list or expected error codes */
    if (
      exception instanceof Prisma.PrismaClientKnownRequestError &&
      exception.code === PRISMA_CODE_UNIQUE_KEY_VIOLATION
    ) {
      // Convert PrismaClientKnownRequestError to UniqueKeyException and pass the error to the client
      const fields = (exception.meta as { target: string[] }).target;
      clientError = new UniqueKeyException(fields);
      this.logger.info(clientError.message, { requestData });
    } else if (exception instanceof AmplicationError) {
      // Convert AmplicationError to ApolloError and pass the error to the client
      clientError = new ApolloError(exception.message);
      this.logger.info(clientError.message, { requestData });
    } else if (exception instanceof HttpException) {
      // Return HTTP Exceptions to the client
      clientError = exception;
      this.logger.info(clientError.message, { requestData });
    } else {
      // Log the original exception and return a generic server error to client
      // eslint-disable-next-line
      // @ts-ignore
      exception.requestData = requestData;
      this.logger.error(exception);
      clientError =
        this.configService.get('NODE_ENV') === 'production'
          ? new InternalServerError()
          : new ApolloError(exception.message);
    }

    return clientError;
  }

  prepareRequestData(host: ArgumentsHost): RequestData | null {
    const { req } = GqlArgumentsHost.create(host).getContext();
    return req ? createRequestData(req) : null;
  }
}
