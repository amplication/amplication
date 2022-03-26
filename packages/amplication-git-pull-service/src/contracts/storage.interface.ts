export interface IStorage {
  /* TODO: change any to a real type */
  manageStorage: (
    data: any,
    storage: FixedSizeArray<5, any>,
    baseDir: string
  ) => void;
}

export type FixedSizeArray<N extends number, T> = N extends 0
  ? never[]
  : {
      0: T;
      length: N;
    } & ReadonlyArray<T>;
