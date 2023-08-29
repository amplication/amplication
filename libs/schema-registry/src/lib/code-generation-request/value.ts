import { DSGResourceData } from "@amplication/code-gen-types";
import { IsEnum, IsString, ValidateNested } from "class-validator";
import { DsgVersionOption } from "../types";

export class Value {
  @IsString()
  buildId!: string;
  @IsString()
  resourceId!: string;
  @ValidateNested()
  dsgResourceData!: DSGResourceData;

  @IsString()
  dsgVersion?: string;

  @IsEnum(DsgVersionOption)
  dsgVersionOption?: DsgVersionOption;
}
