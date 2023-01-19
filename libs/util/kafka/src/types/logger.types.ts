export interface Logger {
  debug(...data: []): void;
  info(...data: []): void;
  warn(...data: []): void;
  error(...data: []): void;
}
