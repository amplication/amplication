import { DSGResourceData } from "@amplication/code-gen-types";
import { IsString, ValidateNested } from "class-validator";
import { CodeGeneratorVersionStrategy } from "../types";

export class Value {
  @IsString()
  buildId!: string;
  @IsString()
  resourceId!: string;
  @ValidateNested()
  dsgResourceData!: DSGResourceData;

  @ValidateNested()
  codeGeneratorVersionOptions!: {
    version?: string;
    selectionStrategy?: CodeGeneratorVersionStrategy;
  };
}
