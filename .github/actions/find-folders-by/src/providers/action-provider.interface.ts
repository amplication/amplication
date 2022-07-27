export interface ActionProvider {
  getWorkingDirectory(): string;
  getFilesToFined(): string[];
  getFoldersToSearch(): string[];
  getIgnoreFolders(): string[];
  getRecursive(): boolean;
  setOutput(actionResults: string[]): void;
  setFailed(message: string | Error): void;
}
