import { Injectable } from "@nestjs/common";
import { IGitClient } from "../../contracts/interfaces/gitClient.interface";
import simpleGit, { SimpleGit } from "simple-git";
import {
  ICloneParams,
  IPullParams,
} from "../../contracts/interfaces/clonePullParams.interface";
import { AmplicationError } from "../../errors/AmplicationError";

/*
 * SimpleGit integration
 * */
@Injectable()
export class GitClientService implements IGitClient {
  async clone(
    cloneParams: ICloneParams,
    baseDir: string,
    installationId: string,
    accessToken: string
  ): Promise<any> {
    try {
      const { repositoryOwner, repositoryName } = cloneParams;
      simpleGit({
        binary: "git",
        maxConcurrentProcesses: 6,
      }).clone(
        `https://${repositoryOwner}:${accessToken}@github.com/${repositoryOwner}/${repositoryName}`,
        baseDir
      );
    } catch (err) {
      throw new AmplicationError(
        `error from GitClientService => clone(): ${err}`
      );
    }
  }

  async pull(pullParams: IPullParams): Promise<any> {
    try {
      const { remote, branch, baseDir } = pullParams;
      simpleGit({
        baseDir,
        binary: "git",
        maxConcurrentProcesses: 6,
      }).pull(remote, branch);
    } catch (err) {
      throw new AmplicationError(
        `error from GitClientService => pull(): ${err}`
      );
    }
  }
}
