export interface IGitClient {
  clone: (
    cloneParams: ICloneParams,
    baseDir: string,
    accessToken: string
  ) => void;
  pull: (pullParams: IPullParams) => void;
}

export interface ICloneParams {
  provider: string;
  owner: string;
  repository: string;
  branch: string;
  commit: string;
  installationId: string;
}

export interface IPullParams {
  branch: string;
  remote: string;
}
