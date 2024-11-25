import { registerEnumType } from "@nestjs/graphql";

export enum EnumCodeGenerator {
  DotNet = "DotNet",
  NodeJs = "NodeJs",
  Blueprint = "Blueprint",
}

registerEnumType(EnumCodeGenerator, { name: "EnumCodeGenerator" });
