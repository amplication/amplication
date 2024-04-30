export interface IFile<T extends any | string | Buffer> {
  path: string;
  content: T;
}
