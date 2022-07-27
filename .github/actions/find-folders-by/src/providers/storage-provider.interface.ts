export interface StorageProvider {
  getSubDirectories(path: string): string[];
  directoryContains(path: string, files: string[]): boolean;
}
