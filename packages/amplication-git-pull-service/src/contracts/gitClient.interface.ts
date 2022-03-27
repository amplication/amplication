import { Response } from "express";
import * as resp from "simple-git/dist/typings/response";

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
