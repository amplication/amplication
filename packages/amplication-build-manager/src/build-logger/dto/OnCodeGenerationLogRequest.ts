import { LogEntry } from "@amplication/util/logging";

export interface CodeGenerationLogRequestDto extends LogEntry {
  buildId: string;
}
