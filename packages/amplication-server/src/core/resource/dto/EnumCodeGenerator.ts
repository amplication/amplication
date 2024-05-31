import { registerEnumType } from "@nestjs/graphql";

export enum EnumCodeGenerator {
  DotNet = "DotNet",
  NodeJs = "NodeJs",
}

registerEnumType(EnumCodeGenerator, { name: "EnumCodeGenerator" });
