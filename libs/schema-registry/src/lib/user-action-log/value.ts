import { EnumActionStepStatus } from "@amplication/code-gen-types/models";
import { LogEntry } from "@amplication/util/logging";
import { IsBoolean, IsEnum, IsString } from "class-validator";

export class Value implements LogEntry {
  @IsString()
  stepId!: string;

  @IsString()
  level!: string;

  @IsString()
  message!: string;

  @IsEnum(EnumActionStepStatus)
  status!: EnumActionStepStatus;

  @IsBoolean()
  isCompleted!: boolean;

  [key: string]: any;
}
