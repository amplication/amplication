import * as fs from "fs";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";
import {
  PushEventMessage,
  GitProviderEnum,
  ErrorMessages,
} from "./git-pull-event.types";

const REMOTE_ORIGIN = "ENV_REMOTE_ORIGIN";

/*
 * SimpleGit integration
 * */
@Injectable()
export class GitClientService {
  git: SimpleGit;
  remoteOrigin: string;
  gitHostDomains: Record<GitProviderEnum, string>;

  constructor(private configService: ConfigService) {
    this.remoteOrigin = configService.get<string>(REMOTE_ORIGIN) || "origin";

    this.gitHostDomains = {
      [GitProviderEnum.Github]: "github.com",
    };

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
        block: 5000,
      },
      completion: {
        onExit: 50,
        onClose: true,
      },
    };

    this.git = simpleGit(options);
  }

  async clone(
    pushEventMessage: PushEventMessage,
    baseDir: string,
    accessToken: string
  ): Promise<void> {
    try {
      const { provider, repositoryOwner, repositoryName, branch, commit } =
        pushEventMessage;
      const repository = `https://${repositoryOwner}:${accessToken}@${this.gitHostDomains[provider]}/${repositoryOwner}/${repositoryName}.git`;

      fs.mkdirSync(baseDir, { recursive: true });

      // TODO: filter out assets and files > 250KB
      await this.git
        .clone(repository, baseDir, ["--branch", branch])
        .cwd(baseDir)
        .checkout(commit);
    } catch (err) {
      throw new Error(`${ErrorMessages.RepositoryCloneFailure}, ${err}`);
    }
  }

  async pull(
    pushEventMessage: PushEventMessage,
    baseDir: string,
    accessToken: string
  ): Promise<void> {
    const { provider, repositoryOwner, repositoryName, branch, commit } =
      pushEventMessage;

    const repository = `https://${repositoryOwner}:${accessToken}@${this.gitHostDomains[provider]}/${repositoryOwner}/${repositoryName}.git`;
    try {
      await this.git.cwd(baseDir).fetch(repository, branch).merge([commit]);
    } catch (err) {
      throw new Error(`${ErrorMessages.RepositoryPullFailure}: ${err}`);
    }
  }
}
