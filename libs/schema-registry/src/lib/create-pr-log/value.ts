import { LogEntry } from "@amplication/util/logging";
import { IsObject, IsString } from "class-validator";

export class Value implements LogEntry {
  [optionName: string]: unknown;
  @IsString()
  buildId!: string;

  @IsString()
  level!: string;

  @IsString()
  message!: string;
}
