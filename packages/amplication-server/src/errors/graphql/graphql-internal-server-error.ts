import { ApolloError } from "apollo-server-express";

export class GraphQLInternalServerError extends ApolloError {
  constructor() {
    super("Internal server error");
  }
}
