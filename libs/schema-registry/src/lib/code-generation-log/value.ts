import { LogEntry } from "@amplication/util/logging";
import { IsString } from "class-validator";

export class Value implements LogEntry {
  @IsString()
  level!: string;
  @IsString()
  buildId!: string;
  @IsString()
  message!: string;
  [key: string]: any;
}
