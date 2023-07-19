import { LogEntry } from "@amplication/util/logging";
import { IsString } from "class-validator";

export class Value implements LogEntry {
  @IsString()
  stepId!: string;

  @IsString()
  level!: string;

  @IsString()
  message!: string;

  [key: string]: any;
}
