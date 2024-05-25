import { IFile } from "./file.types";

export interface IFileMap<T extends any | string | Buffer> {
  merge(anotherMap: IFileMap<T>): Promise<IFileMap<T>>;

  mergeMany(maps: IFileMap<T>[]): Promise<void>;

  set(file: IFile<T>): void;

  get(path: string): IFile<T> | null;

  getAll(): IterableIterator<IFile<T>>;

  replace(oldFile: IFile<T>, newFile: IFile<T>): void;

  replaceFilesPath(fn: (path: string) => string): void;
  removeMany(paths: string[]): void;

  replaceFilesCode(fn: (path: string, code: T) => T): Promise<void>;
}
