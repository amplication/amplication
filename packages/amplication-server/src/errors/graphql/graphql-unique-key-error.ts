import { ApolloError } from "apollo-server-express";

export class GraphQLUniqueKeyException extends ApolloError {
  constructor(fields: string[]) {
    super(
      `Another record with the same key already exist (${fields.join(", ")})`
    );
  }
}
