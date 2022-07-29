import { ActionProvider } from './action-provider.interface';
import core = require('@actions/core');

export class GitHubActionProvider implements ActionProvider {
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

  setOutput(actionResults: string[]): void {
    core.setOutput('folders', actionResults);
  }

  setFailed(message: string | Error): void {
    core.setFailed(message);
  }

  getFilesToFined(): string[] {
    return GitHubActionProvider.getInputAsArray('files-to-find');
  }

  getFoldersToSearch(): string[] {
    return GitHubActionProvider.getInputAsArray('folders-to-search');
  }

  getIgnoreFolders(): string[] {
    return GitHubActionProvider.getInputAsArray('ignore-folders');
  }

  getRecursive(): boolean {
    try {
      return JSON.parse(core.getInput('search-recursive'));
    } catch (err) {
      console.error(`failed to read search-recursive input`);
      throw err;
    }
  }

  private static getInputAsArray(key: string): string[] {
    try {
      const arrayString = core.getInput(key);
      console.log(`${key}: ${arrayString}`);
      return JSON.parse(arrayString);
    } catch (err) {
      console.error(`failed to read ${key} input`);
      throw err;
    }
  }
}
