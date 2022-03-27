import { Injectable } from "@nestjs/common";
import {
  ICloneParams,
  IGitClient,
  IPullParams,
} from "../../contracts/gitClient.interface";
import simpleGit, { SimpleGit } from "simple-git";

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
    const { repositoryOwner, repositoryName } = cloneParams;
    simpleGit({
      binary: "git",
      maxConcurrentProcesses: 6,
    }).clone(
      `https://${repositoryOwner}:${accessToken}@github.com/${repositoryOwner}/${repositoryName}`,
      baseDir
    );
  }

  async pull(pullParams: IPullParams): Promise<any> {
    const { remote, branch, baseDir } = pullParams;
    /* TODO: figure out how to pass here the baseDir and the accessToken => simpleGit({//options//}) */
    simpleGit({
      baseDir,
      binary: "git",
      maxConcurrentProcesses: 6,
    }).pull(remote, branch);
  }
}
