import { IFile } from "./file.types";
import { BuildLogger } from "../build-logger";
import { IFileMap } from "./file-map.types";

/**
 * Legacy name: ModuleMap
 */
/**
 * A map of files
 * @typeParam T The type of the file content
 */
export class FileMap<T> implements IFileMap<T> {
  private map: Map<string, IFile<T>> = new Map();

  constructor(protected readonly logger: BuildLogger) {}

  /**
   * Merge another map into this map
   *
   * @param anotherMap The map to merge into this map
   * @returns This map
   */
  async merge(anotherMap: FileMap<T>): Promise<FileMap<T>> {
    for await (const file of anotherMap.getAll()) {
      await this.set(file);
    }

    return this;
  }

  /**
   * Merge many maps into this map
   * @param maps The maps to merge into this map
   * @returns This map
   * @see merge
   */
  async mergeMany(maps: FileMap<T>[]): Promise<void> {
    for await (const map of maps) {
      await this.merge(map);
    }
  }

  /**
   * Set a file in the map. If the file already exists, it will be overwritten and a log message will be printed.
   * @param file The file to add to the set
   */
  async set(file: IFile<T>) {
    if (this.map.has(file.path)) {
      await this.logger.warn(
        `File ${file.path} already exists. Overwriting...`
      );
    }

    this.map.set(file.path, file);
  }

  /**
   * @returns A file for the given path, or undefined if no file exists for the path
   */
  get(path: string): IFile<T> | null {
    return this.map.get(path) ?? null;
  }

  /**
   * Replace a file in the map. If the file does not exist, it will be added to the set.
   * @param oldFile The file to replace
   * @param newFile The new file to replace the old file with
   */
  replace(oldFile: IFile<T>, newFile: IFile<T>): void {
    if (newFile.path !== oldFile.path) {
      this.map.delete(oldFile.path);
    }

    this.map.set(newFile.path, newFile);
  }

  /**
   * Replace all files paths using a function
   * @param fn A function that receives a file path and returns a new path
   */
  replaceFilesPath(fn: (path: string) => string): void {
    const files = Array.from(this.map.values());
    for (const oldFile of files) {
      const newModule: IFile<T> = {
        ...oldFile,
        path: fn(oldFile.path),
      };
      this.replace(oldFile, newModule);
    }
  }

  /**
   * Remove files from the map
   * @param paths An array of file paths to remove
   */
  removeMany(paths: string[]): void {
    for (const path of paths) {
      this.map.delete(path);
    }
  }

  /**
   * Replace all files code using a function
   * @param fn A function that receives a file code and returns a new code
   */
  async replaceFilesCode(fn: (path: string, code: T) => T): Promise<void> {
    for await (const file of this.getAll()) {
      file.code = fn(file.path, file.code);
      this.map.set(file.path, file);
    }
  }

  /**
   * @returns All files in the map
   */
  getAll(): IterableIterator<IFile<T>> {
    return this.map.values();
  }
}
