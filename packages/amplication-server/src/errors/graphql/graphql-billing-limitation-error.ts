import { GraphQLErrorCode } from "@amplication/graphql-error-codes";
import { BillingFeature } from "@amplication/util-billing-types";
import { ApolloError } from "apollo-server-express";

export class GraphQLBillingError extends ApolloError {
  constructor(
    message: string,
    billingFeature: BillingFeature,
    bypassAllowed: boolean
  ) {
    super(message, GraphQLErrorCode.BILLING_LIMITATION_ERROR, {
      bypassAllowed,
      billingFeature,
    });
  }
}
