import * as resp from "simple-git/dist/typings/response";
import { Response } from "simple-git/dist/typings/simple-git";

export interface IGitClient {
  clone: (
    provider: string,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    commit: string,
    pushedAt: Date,
    baseDir: string,
    installationId: string,
    accessToken: string
  ) => Promise<void>;
  pull: (
    remote: string,
    branch: string,
    commit: string,
    baseDir: string,
  ) => Promise<void>;
}
