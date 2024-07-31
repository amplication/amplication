import { LogEntry } from "@amplication/util/logging";
import { IsString } from "class-validator";

export class Value implements LogEntry {
  [optionName: string]: unknown;
  @IsString()
  resourceId!: string;

  @IsString()
  level!: string;

  @IsString()
  buildId!: string;

  @IsString()
  message!: string;
}
