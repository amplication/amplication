import { DSGResourceData } from "@amplication/code-gen-types";
import { IsString, ValidateNested } from "class-validator";
import { CodeGenerationVersionStrategy } from "../types";

export class Value {
  @IsString()
  buildId!: string;
  @IsString()
  resourceId!: string;
  @ValidateNested()
  dsgResourceData!: DSGResourceData;

  @ValidateNested()
  codeGenerationVersionOptions!: {
    version?: string;
    selectionStrategy?: CodeGenerationVersionStrategy;
  };
}
