import { registerEnumType } from "@nestjs/graphql";

export enum EnumModuleActionRestInputSource {
  Query = "Query",
  Params = "Params",
  Body = "Body",
  Split = "Split",
}

registerEnumType(EnumModuleActionRestInputSource, {
  name: "EnumModuleActionRestInputSource",
});
