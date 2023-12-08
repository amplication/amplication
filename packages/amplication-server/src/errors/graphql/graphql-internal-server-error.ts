import { GraphQLErrorCode } from "@amplication/graphql-error-codes";
import { ApolloError } from "apollo-server-express";

export class GraphQLInternalServerError extends ApolloError {
  constructor() {
    super("Internal server error", GraphQLErrorCode.INTERNAL_SERVER_ERROR);
  }
}
