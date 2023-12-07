import { ApolloError } from "apollo-server-express";

export class GraphQLBillingError extends ApolloError {
  constructor(message: string, bypassAllowed: boolean) {
    super(message, "BILLING_LIMITATION_ERROR", { bypassAllowed });
  }
}
