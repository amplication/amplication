import {ActionResult} from "../entities/action-result.interface";

export interface ActionProvider {
  getWorkingDirectory(): string;
  getFolders(): string[];
  setOutput(actionResults: ActionResult[]): void;
  setFailed(message: string | Error): void;
}
