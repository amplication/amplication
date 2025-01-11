import { DSGResourceData } from "@amplication/code-gen-types";
import { IsString, ValidateNested } from "class-validator";

export class Value {
  @IsString()
  resourceId!: string;

  @IsString()
  buildId!: string;

  @ValidateNested()
  dsgResourceData!: DSGResourceData;
}
