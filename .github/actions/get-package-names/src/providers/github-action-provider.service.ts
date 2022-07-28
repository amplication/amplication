import { ActionProvider } from './action-provider.interface';
import {ActionResult} from "../entities/action-result.interface";
const core = require('@actions/core');

export class GitHubActionProvider implements ActionProvider {

  getFolders(): string[] {
    try {
      const folders = core.getInput('folders');
      console.log(`FOLDERS: ${folders}`);
      return JSON.parse(folders);
    } catch (err) {
      console.error('failed to read folders input',err);
      throw err;
    }
  }

  getWorkingDirectory(): string {
    const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE;
    if (GITHUB_WORKSPACE) {
      console.log(`WORKING_DIRECTORY: ${GITHUB_WORKSPACE}`);
      return GITHUB_WORKSPACE;
    } else {
      console.error('failed to read GITHUB_WORKSPACE environment variable');
      throw new Error('failed to read GITHUB_WORKSPACE environment variable');
    }
  }

  setOutput(actionResults: ActionResult[]): void {
    core.setOutput('package_names', actionResults);
  }

  setFailed(message: string | Error): void {
    core.setFailed(message);
  }
}