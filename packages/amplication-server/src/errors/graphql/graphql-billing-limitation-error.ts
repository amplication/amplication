import { GraphQLErrorCode } from "@amplication/graphql-error-codes";
import { ApolloError } from "apollo-server-express";

export class GraphQLBillingError extends ApolloError {
  constructor(message: string, bypassAllowed: boolean) {
    super(message, GraphQLErrorCode.BILLING_LIMITATION_ERROR, {
      bypassAllowed,
    });
  }
}
