import { ActionProvider } from '../providers/action-provider.interface';
import _ from 'underscore';
import { StorageProvider } from '../providers/storage-provider.interface';

export class App {
  constructor(
    private actionProvider: ActionProvider,
    private storageProvider: StorageProvider
  ) {}

  public main = () => {
    try {
      console.log(`START GETTING ACTION INPUTS`);
      const workingDirectory: string =
        this.actionProvider.getWorkingDirectory();
      const filesToFind: string[] = this.actionProvider.getFilesToFined();
      const foldersToSearch: string[] =
        this.actionProvider.getFoldersToSearch();
      const ignoreFolders: string[] = this.actionProvider.getIgnoreFolders();
      const recursive: boolean = this.actionProvider.getRecursive();

      console.log(`STARTING FOLDERS SEARCH...`);
      const results: string[] = this.findFoldersContainingDockerfile(
        workingDirectory,
        filesToFind,
        foldersToSearch,
        ignoreFolders,
        recursive
      );

      console.log(`The action results payload`, results);
      this.actionProvider.setOutput(results);
    } catch (err) {
      this.actionProvider.setFailed(err as Error);
    }
  };

  private splitFoldersByFile(
    workingDirectory: string,
    directories: string[],
    filesToFind: string[]
  ): { foldersContainingFiles: string[]; foldersNotContainsFiles: string[] } {
    const t = _.groupBy(directories, (element: string): string => {
      return this.storageProvider.directoryContains(
        `${workingDirectory}/${element}`,
        filesToFind
      )
        ? 'foldersContainingFiles'
        : 'foldersNotContainsFiles';
    }) as {
      foldersContainingFiles: string[];
      foldersNotContainsFiles: string[];
    };

    return {
      foldersContainingFiles: t.foldersContainingFiles || [],
      foldersNotContainsFiles: t.foldersNotContainsFiles || [],
    };
  }

  public findFoldersContainingDockerfile(
    workingDirectory: string,
    filesToFind: string[],
    foldersToSearch: string[],
    ignoreFolders: string[],
    recursive: boolean
  ): string[] {
    foldersToSearch = foldersToSearch.filter((directory) => {
      return !ignoreFolders.some((ignoredDirectory) =>
        directory.endsWith(ignoredDirectory)
      );
    });
    const { foldersContainingFiles, foldersNotContainsFiles } =
      this.splitFoldersByFile(workingDirectory, foldersToSearch, filesToFind);
    if (recursive) {
      if (foldersToSearch.length === 0) {
        return [];
      }
      return foldersContainingFiles.concat(
        foldersNotContainsFiles
          .map((directory) => {
            return this.storageProvider
              .getSubDirectories(`${workingDirectory}/${directory}`)
              .map((subDirectory) => `${directory}/${subDirectory}`);
          })
          .flatMap((subDirectories) => {
            return this.findFoldersContainingDockerfile(
              workingDirectory,
              filesToFind,
              subDirectories,
              ignoreFolders,
              recursive
            );
          })
      );
    } else {
      return foldersContainingFiles;
    }
  }
}
