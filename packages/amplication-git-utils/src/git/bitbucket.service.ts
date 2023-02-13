import {
  Branch,
  CreateBranchIfNotExistsArgs,
  CreateCommitArgs,
  CreatePullRequestForBranchArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
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

  async getAuthByTemporaryCode(code: string): Promise<unknown> {
    const accessTokenUrl = " https://bitbucket.org/site/oauth2/access_token";
    console.log("code", code);
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

      return { access_token, refreshToken };
    } catch (error) {
      // TODO: handle error
      console.log(error);
    }
  }

  getGitInstallationUrl(amplicationWorkspaceId: string): Promise<string> {
    return Promise.resolve(
      `Not implemented for ${this.gitProviderArgs.provider} provider`
    );
  }

  getRepository(
    getRepositoryArgs: GetRepositoryArgs
  ): Promise<RemoteGitRepository> {
    console.log("Method not implemented.");
  }

  getRepositories(
    getRepositoriesArgs: GetRepositoriesArgs
  ): Promise<RemoteGitRepos> {
    console.log("Method not implemented.");
  }

  createRepository(
    createRepositoryArgs: CreateRepositoryArgs
  ): Promise<RemoteGitRepository> {
    console.log("Method not implemented.");
  }

  deleteGitOrganization(): Promise<boolean> {
    console.log("Method not implemented.");
  }

  getOrganization(): Promise<RemoteGitOrganization> {
    console.log("Method not implemented.");
  }

  getFile(file: GetFileArgs): Promise<GitFile> {
    console.log("Method not implemented.");
  }

  createPullRequestFromFiles(
    createPullRequestFromFilesArgs: CreatePullRequestFromFilesArgs
  ): Promise<string> {
    console.log("Method not implemented.");
  }

  createBranchIfNotExists(
    createBranchIfNotExistsArgs: CreateBranchIfNotExistsArgs
  ): Promise<Branch> {
    console.log("Method not implemented.");
  }

  createCommit(createCommitArgs: CreateCommitArgs): Promise<void> {
    console.log("Method not implemented.");
  }

  getPullRequestForBranch(
    getPullRequestForBranchArgs: GetPullRequestForBranchArgs
  ): Promise<{ url: string; number: number }> {
    console.log("Method not implemented.");
  }

  createPullRequestForBranch(
    createPullRequestForBranchArgs: CreatePullRequestForBranchArgs
  ): Promise<string> {
    console.log("Method not implemented.");
  }
}
