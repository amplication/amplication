import { GraphQLBillingErrorCode } from "@amplication/util-billing-types";
import { ApolloError } from "apollo-server-express";

export class GraphQLBillingError extends ApolloError {
  constructor(message: string, bypassAllowed: boolean) {
    super(message, GraphQLBillingErrorCode.BILLING_LIMITATION_ERROR, {
      bypassAllowed,
    });
  }
}
