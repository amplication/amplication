export interface IStorage {
  manageStorage: (
    srcDir: string,
    destDir: string,
    gitRepositoryFiles: any
  ) => void;
}
