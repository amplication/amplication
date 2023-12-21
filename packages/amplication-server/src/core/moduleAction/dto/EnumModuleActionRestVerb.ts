import { registerEnumType } from "@nestjs/graphql";

export enum EnumModuleActionRestVerb {
  Get = "Get",
  Post = "Post",
  Put = "Put",
  Patch = "Patch",
  Delete = "Delete",
  Head = "Head",
  Options = "Options",
  Trace = "Trace",
}

registerEnumType(EnumModuleActionRestVerb, {
  name: "EnumModuleActionRestVerb",
});
