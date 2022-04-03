import { Injectable } from "@nestjs/common";
import { IGitClient } from "../../contracts/interfaces/gitClient.interface";
import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";
import { CustomError } from "../../errors/CustomError";
import * as fs from "fs";

/*
 * SimpleGit integration
 * */
@Injectable()
export class GitClientService implements IGitClient {
  git: SimpleGit;

  constructor() {
    /*
     * @maxConcurrentProcesses: each `simple-git` instance limits the number of
     * spawned child processes that can be run simultaneously and manages the queue
     * of pending tasks for you
     *
     * @timeout(milliseconds): handle the case where the underlying git processes
     * appear to hang wait after last received content on either stdOut or stdErr
     * streams before sending a SIGINT kill message.
     *
     * @completion: (default: onClose = true, onExit = false)
     * onExit (boolean / number(ms)):  wait an arbitrary number of ms after the
     * event has fired before treating the task as complete
     * onClose (boolean)
     * - false: ignore this event from the child process
     * - true: treat the task as complete as soon as the event has fired
     * it should only be necessary to handle the exit event when the child processes
     * are configured to not close (with keep-alive)
     * */

    const options: Partial<SimpleGitOptions> = {
      binary: "git",
      maxConcurrentProcesses: 6,
      timeout: {
        block: 2000,
      },
      completion: {
        onExit: 50,
        onClose: true,
      },
    };

    this.git = simpleGit(options);
  }

  async clone(
    provider: string,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    commit: string,
    pushedAt: Date,
    baseDir: string,
    installationId: string,
    accessToken: string
  ): Promise<void> {
    try {
      // baseDir: `${os.homedir()}/git-remote/${repositoryOwner}/${repositoryName}/${branch}/${commit}`;
      fs.mkdirSync(baseDir, { recursive: true });
      const repository = `https://${repositoryOwner}:${accessToken}@github.com/${repositoryOwner}/${repositoryName}.git`;
      // TODO: filter out assets
      this.git
        .clone(repository, baseDir, ["--branch", branch])
        .cwd(baseDir)
        .checkout(commit);
    } catch (err) {
      throw new CustomError("failed to clone a repository", err);
    }
  }

  async pull(
    remote: string,
    branch: string,
    commit: string,
    baseDir: string
  ): Promise<void> {
    try {
      this.git.cwd(baseDir).fetch(remote, branch).merge([commit]);
    } catch (err) {
      throw new CustomError("failed to pull a repository", err);
    }
  }
}
