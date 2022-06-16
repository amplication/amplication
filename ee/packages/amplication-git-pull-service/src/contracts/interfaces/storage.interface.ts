export interface IStorage {
  copyDir: (srcDir: string, destDir: string) => Promise<void>;
  deleteDir: (dir: string) => void;
}
