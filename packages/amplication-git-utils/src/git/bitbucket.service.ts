import {
  Branch,
  CreateBranchIfNotExistsArgs,
  CreateCommitArgs,
  CreatePullRequestForBranchArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
  GetAuthByTemporaryCodeResponse,
  GetFileArgs,
  GetPullRequestForBranchArgs,
  GetRepositoriesArgs,
  GetRepositoryArgs,
  GitFile,
  GitProvider,
  GitProviderArgs,
  RemoteGitOrganization,
  RemoteGitRepos,
  RemoteGitRepository,
} from "../types";
import fetch from "node-fetch";
import { CustomError, NotImplementedError } from "../utils/custom-error";

export class BitBucketService implements GitProvider {
  private clientId: string;
  private clientSecret: string;
  private callbackUrl: string;
  private accessToken: string;
  private refreshToken: string;

  constructor(private readonly gitProviderArgs: GitProviderArgs) {
    // TODO: move env variables to the server config
    const { BITBUCKET_CLIENT_ID, BITBUCKET_CLIENT_SECRET, CALLBACK_URL } =
      process.env;

    if (!BITBUCKET_CLIENT_ID || !BITBUCKET_CLIENT_SECRET || !CALLBACK_URL) {
      throw new Error("Missing BitBucket env variables");
    }

    this.clientId = BITBUCKET_CLIENT_ID;
    this.clientSecret = BITBUCKET_CLIENT_SECRET;
    this.callbackUrl = CALLBACK_URL;

    console.log("clientId", this.clientId);
    console.log("clientSecret", this.clientSecret);
    console.log("callbackUrl", this.callbackUrl);
  }

  async init(): Promise<void> {
    // this.accessToken = await this.createConsumerApp();
  }

  async getAuthByTemporaryCode(
    code: string
  ): Promise<GetAuthByTemporaryCodeResponse> {
    const accessTokenUrl = "https://bitbucket.org/site/oauth2/access_token";
    try {
      const request = await fetch(accessTokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`
          ).toString("base64")}`,
        },
        body: `grant_type=authorization_code&code=${code}`,
      });

      const response = await request.json();
      // const accessToken = response.data.access_token;
      console.log("accessToken", { response });

      const { access_token, refreshToken } = response;
      this.accessToken = access_token;
      this.refreshToken = refreshToken;
      return { accessToken: access_token, refreshToken };
    } catch (error) {
      // TODO: figure out how the error is look like
      const { message, code, status, cause } = error;
      throw new CustomError(message, { code, status, cause });
    }
  }

  getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    return Promise.resolve(
      `Not implemented for ${this.gitProviderArgs.provider} provider`
    );
  }

  async getWorkspaces(): Promise<void> {
    fetch("https://api.bitbucket.org/2.0/workspaces", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response.text();
      })
      .then((text) => console.log(text, "workspaces"))
      .catch((err) => console.error(err));
  }

  getRepository(
    getRepositoryArgs: GetRepositoryArgs
  ): Promise<RemoteGitRepository> {
    throw NotImplementedError;
  }

  getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    throw NotImplementedError;
  }

  createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository> {
    throw NotImplementedError;
  }

  deleteGitOrganization(): Promise<boolean> {
    throw NotImplementedError;
  }

  getOrganization(): Promise<RemoteGitOrganization> {
    throw NotImplementedError;
  }

  getFile(file: GetFileArgs): Promise<GitFile> {
    throw NotImplementedError;
  }

  createPullRequestFromFiles(
    createPullRequestFromFilesArgs: CreatePullRequestFromFilesArgs
  ): Promise<string> {
    throw NotImplementedError;
  }

  createBranchIfNotExists(
    createBranchIfNotExistsArgs: CreateBranchIfNotExistsArgs
  ): Promise<Branch> {
    throw NotImplementedError;
  }

  createCommit(createCommitArgs: CreateCommitArgs): Promise<void> {
    throw NotImplementedError;
  }

  getPullRequestForBranch(
    getPullRequestForBranchArgs: GetPullRequestForBranchArgs
  ): Promise<{ url: string; number: number }> {
    throw NotImplementedError;
  }

  createPullRequestForBranch(
    createPullRequestForBranchArgs: CreatePullRequestForBranchArgs
  ): Promise<string> {
    throw NotImplementedError;
  }
}
