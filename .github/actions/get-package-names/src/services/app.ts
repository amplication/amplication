import { ActionProvider } from '../providers/action-provider.interface';
import { readFile } from '../utils/utils';
import { ActionResult } from '../entities/action-result.interface';

export class App {
  constructor(private actionProvider: ActionProvider) {}

  public main = () => {
    try {
      console.log(`START GETTING ACTION INPUTS`);
      const workingDirectory = this.actionProvider.getWorkingDirectory();
      const folders = this.actionProvider.getFolders();

      console.log(`GETTING FOLDERS APP NAMES...`);
      const results = this.findFoldersAppName(workingDirectory, folders);

      console.log(`The action results payload`, results);
      this.actionProvider.setOutput(results);
    } catch (err) {
      this.actionProvider.setFailed(err as Error);
    }
  };

  public findFoldersAppName = (
    workingDirectory: string,
    folders: string[]
  ): ActionResult[] => {
    return folders
      .flatMap((folder) => {
        console.log(`GETTING FOLDER ${folder} APP NAME...`);
        const appName = this.getAppName(workingDirectory, folder);

        if (appName) {
          console.log(`FOLDER ${folder} APP NAME is ${appName}`);
        } else {
          console.warn(
            `APP NAME NOT FOUND FOR FOLDER ${folder} SKIPPING FOLDER`
          );
        }

        return {
          folder: folder,
          name: appName,
        };
      })
      .filter((value) => value.name);
  };

  public getAppName = (workingDirectory: string, directory: string) => {
    try {
      const text = readFile(`${workingDirectory}/${directory}/package.json`);
      const json = JSON.parse(text);
      return json.name;
    } catch (err) {
      console.warn(`Error while reading ${directory} package.json`);
      return null;
    }
  };
}
