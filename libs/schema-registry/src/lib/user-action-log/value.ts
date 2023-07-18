import { EnumActionLogLevel } from "@amplication/code-gen-types/models";
import { IsEnum, IsString } from "class-validator";

export class Value {
  @IsString()
  stepId!: string;

  @IsString()
  message!: string;

  @IsEnum(EnumActionLogLevel)
  level!: EnumActionLogLevel;
}
