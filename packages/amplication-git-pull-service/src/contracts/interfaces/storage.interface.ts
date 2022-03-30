export interface IStorage {
  manageStorage: (srcDir: string, destDir: string) => Promise<void>;
}
