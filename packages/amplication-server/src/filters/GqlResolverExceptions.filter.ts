// This exception filter should be used for every resolver
// e.g:
// @UseFilters(GqlResolverExceptionsFilter)
// export class AuthResolver {
// It logs the exception with context information like IP, Host, UserId
// It uses nest logger module to log

import { Catch, ArgumentsHost, Inject, HttpException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExceptionFilter, GqlArgumentsHost } from "@nestjs/graphql";
import { Prisma } from "../prisma";
import { ApolloError } from "apollo-server-express";
import { Request } from "express";
import { AmplicationError } from "../errors/AmplicationError";
import { BillingLimitationError } from "../errors/BillingLimitationError";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { GraphQLUniqueKeyException } from "../errors/graphql/graphql-unique-key-error";
import { GraphQLInternalServerError } from "../errors/graphql/graphql-internal-server-error";
import { GraphQLBillingError } from "../errors/graphql/graphql-billing-limitation-error";

export type RequestData = {
  query: string;
  hostname: string;
  ip: string;
  userId: string;
};

interface RequestWithUser extends Request {
  user: { id: string } | null;
}

export const PRISMA_CODE_UNIQUE_KEY_VIOLATION = "P2002";

export function createRequestData(req: RequestWithUser): RequestData {
  const user = req.user;
  return {
    query: req.body?.query,
    hostname: req.hostname,
    ip: req.ip,
    userId: user?.id,
  };
}

@Catch()
export class GqlResolverExceptionsFilter implements GqlExceptionFilter {
  constructor(
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
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
      // Convert PrismaClientKnownRequestError to GraphQLUniqueKeyException and pass the error to the client
      const fields = (exception.meta as { target: string[] }).target;
      clientError = new GraphQLUniqueKeyException(fields);
      this.logger.info(clientError.message, { requestData });
    } else if (exception instanceof BillingLimitationError) {
      clientError = new GraphQLBillingError(
        exception.message,
        exception.billingFeature,
        exception.bypassAllowed
      );
      this.logger.info(clientError.message, { exception });
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
      this.logger.error(exception.message, exception);
      clientError =
        this.configService.get("NODE_ENV") === "production"
          ? new GraphQLInternalServerError()
          : new ApolloError(exception.message);
    }

    return clientError;
  }

  prepareRequestData(host: ArgumentsHost): RequestData | null {
    const { req } = GqlArgumentsHost.create(host).getContext();
    return req ? createRequestData(req) : null;
  }
}
