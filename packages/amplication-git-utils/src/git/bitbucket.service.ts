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
    console.log("code", this.gitProviderArgs.code);
  }

  async init(): Promise<void> {
    this.accessToken = await this.createConsumerApp();
  }

  async createConsumerApp(): Promise<string> {
    const url = "https://bitbucket.org/site/oauth2/authorize";
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", this.gitProviderArgs.code);
    params.append("client_id", this.clientId);
    params.append("client_secret", this.clientSecret);
    params.append("redirect_uri", this.callbackUrl);

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    try {
      const request = await fetch(url, {
        method: "POST",
        body: params,
        headers,
      });
      const response = await request.json();
      console.log("response", response);
      // const accessToken = response.data.access_token;
      // console.log("accessToken", accessToken);
      // return accessToken;
      return "accessToken";
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
