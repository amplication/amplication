import { Injectable } from "@nestjs/common";
import { IGitClient } from "../../contracts/interfaces/gitClient.interface";
import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";
import { CustomError } from "../../errors/CustomError";
import * as fs from "fs";
import { EventData } from "../../contracts/interfaces/eventData";
import { ErrorMessages } from "../../constants/errorMessages";

/*
 * SimpleGit integration
 * */
@Injectable()
export class GitClientService implements IGitClient {
  git: SimpleGit;

  constructor(private provideDomain: string) {
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
    eventData: EventData,
    baseDir: string,
    installationId: string,
    accessToken: string
  ): Promise<void> {
    try {
      const { provider, repositoryOwner, repositoryName, branch, commit } =
        eventData;
      fs.mkdirSync(baseDir, { recursive: true });
      const repository = `https://${repositoryOwner}:${accessToken}@${this.provideDomain}/${repositoryOwner}/${repositoryName}.git`;
      // TODO: filter out assets and files > 250KB
      this.git
        .clone(repository, baseDir, ["--branch", branch])
        .cwd(baseDir)
        .checkout(commit);
    } catch (err) {
      throw new CustomError(ErrorMessages.REPOSITORY_CLONE_FAILURE, err);
    }
  }

  async pull(branch: string, commit: string, baseDir: string): Promise<void> {
    try {
      this.git.cwd(baseDir).fetch("origin", branch).merge([commit]);
    } catch (err) {
      throw new CustomError(ErrorMessages.REPOSITORY_CLONE_FAILURE, err);
    }
  }
}
