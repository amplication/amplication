import { ICloneParams, IPullParams } from "./clonePullParams.interface";

export interface IGitClient {
  clone: (
    cloneParams: ICloneParams,
    baseDir: string,
    installationId: string,
    accessToken: string
  ) => Promise<any>;
  pull: (
    pullParams: IPullParams,
    baseDir: string,
    installationId: string
  ) => Promise<any>;
}
