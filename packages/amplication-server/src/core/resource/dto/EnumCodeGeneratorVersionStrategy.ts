import { registerEnumType } from "@nestjs/graphql";

export enum CodeGeneratorVersionStrategy {
  LatestMajor = "LatestMajor",
  LatestMinor = "LatestMinor",
  Specific = "Specific",
}

registerEnumType(CodeGeneratorVersionStrategy, {
  name: "CodeGeneratorVersionStrategy",
});
