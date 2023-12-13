import { GraphQLScalarType } from "graphql";

const graphQLBigInt = new GraphQLScalarType({
  name: "BigInt",
  description: "GraphQL representation of BigInt",

  parseValue(value: unknown): number | null {
    return typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "bigint"
      ? Number(value)
      : null;
  },

  serialize(value: unknown): string | null {
    return typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "bigint"
      ? value.toString(10)
      : null;
  },
});

export { graphQLBigInt as GraphQLBigInt };
