export interface IGitClient {
  clone: (
    cloneParams: ICloneParams,
    baseDir: string,
    installationId: string,
    accessToken: string
  ) => void;
  pull: (
    pullParams: IPullParams,
    baseDir: string,
    installationId: string
  ) => void;
}

export interface ICloneParams {
  provider: string;
  repositoryOwner: string;
  repositoryName: string;
  branch: string;
  commit: string;
}

export interface IPullParams {
  branch: string;
  remote: string;
  commit: string;
}
