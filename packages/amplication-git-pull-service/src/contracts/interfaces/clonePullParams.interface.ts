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
  baseDir: string;
  commit?: string;
}
