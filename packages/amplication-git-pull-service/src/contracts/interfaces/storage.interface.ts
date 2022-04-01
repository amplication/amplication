export interface IStorage {
  copyDir: (srcDir: string, destDir: string) => Promise<void>;
  removeNonCodeFiles: (
    srcDir: string,
    forbiddenFilesExtension: string[]
  ) => Promise<void>;
}
