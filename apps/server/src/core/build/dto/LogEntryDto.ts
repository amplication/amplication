import { LogEntry } from "winston";

export class LogEntryDto implements LogEntry {
  level: string;
  message: string;
  buildId: string;
  [key: string]: any;
}
