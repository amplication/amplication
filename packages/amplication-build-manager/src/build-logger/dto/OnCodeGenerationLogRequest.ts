import { LogEntry } from "@amplication/util/logging";

export interface OnCodeGenerationLogRequest extends LogEntry {
  buildId: string;
}
