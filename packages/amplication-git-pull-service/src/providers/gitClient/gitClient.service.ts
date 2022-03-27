import { Injectable } from "@nestjs/common";
import {
  ICloneParams,
  IGitClient,
  IPullParams,
} from "../../contracts/gitClient.interface";
import simpleGit, { SimpleGit } from "simple-git";
import { Response } from "simple-git/dist/typings/simple-git";
import * as resp from "simple-git/dist/typings/response";

/*
 * SimpleGit integration
 * */
@Injectable()
export class GitClientService implements IGitClient {
  // @ts-ignore
  clone(
    cloneParams: ICloneParams,
    baseDir: string,
    installationId: string,
    accessToken: string
  ): Response<string> {
    const { repositoryOwner, repositoryName } = cloneParams;
    return simpleGit({
      binary: "git",
      maxConcurrentProcesses: 6,
    }).clone(
      `https://${repositoryOwner}:${accessToken}@github.com/${repositoryOwner}/${repositoryName}`,
      baseDir
    );
  }

  // @ts-ignore
  pull(pullParams: IPullParams): Response<resp.PullResult> {
    const { remote, branch, baseDir } = pullParams;
    /* TODO: figure out how to pass here the baseDir and the accessToken => simpleGit({//options//}) */
    return simpleGit({
      baseDir,
      binary: "git",
      maxConcurrentProcesses: 6,
    }).pull(remote, branch);
  }
}
