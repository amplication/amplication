import { registerEnumType } from "@nestjs/graphql";

export enum EnumModuleActionGqlOperation {
  Mutation = "Mutation",
  Query = "Query",
}

registerEnumType(EnumModuleActionGqlOperation, {
  name: "EnumModuleActionGqlOperation",
});
