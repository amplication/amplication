import {
  CloneUrlArgs,
  CreateBranchArgs,
  CreatePullRequestCommentArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
  GetBranchArgs,
  GetFileArgs,
  GetRepositoriesArgs,
  GetRepositoryArgs,
  GitProviderCreatePullRequestArgs,
  GitProviderGetPullRequestArgs,
} from "../../types";
import { GitLabService } from "./gitlab.service";
import { MockedLogger } from "@amplication/util/logging/test-utils";

describe("AwsCodeCommit", () => {
  let gitProvider: GitLabService;

  beforeEach(() => {
    gitProvider = new GitLabService(null, MockedLogger);
  });

  it("should throw an error when calling init()", async () => {
    await expect(gitProvider.init()).rejects.toThrowError(
      "Method not implemented."
    );
  });

  it("should throw an error when calling getGitInstallationUrl()", async () => {
    await expect(
      gitProvider.getGitInstallationUrl("workspaceId")
    ).rejects.toThrowError("Method not implemented.");
  });

  it("should throw an error when calling getCurrentOAuthUser()", async () => {
    await expect(
      gitProvider.getCurrentOAuthUser("accessToken")
    ).rejects.toThrowError("Method not implemented.");
  });

  it("should throw an error when calling getOAuthTokens()", async () => {
    await expect(
      gitProvider.getOAuthTokens("authorizationCode")
    ).rejects.toThrowError("Method not implemented.");
  });

  it("should throw an error when calling refreshAccessToken()", async () => {
    await expect(gitProvider.refreshAccessToken()).rejects.toThrowError(
      "Method not implemented."
    );
  });

  it("should throw an error when calling getGitGroups()", async () => {
    await expect(gitProvider.getGitGroups()).rejects.toThrowError(
      "Method not implemented."
    );
  });

  it("should throw an error when calling getRepository()", async () => {
    const getRepositoryArgs = <GetRepositoryArgs>{
      /* provide appropriate arguments */
    };
    await expect(
      gitProvider.getRepository(getRepositoryArgs)
    ).rejects.toThrowError("Method not implemented.");
  });

  it("should throw an error when calling getRepositories()", async () => {
    const getRepositoriesArgs = <GetRepositoriesArgs>{
      /* provide appropriate arguments */
    };
    await expect(
      gitProvider.getRepositories(getRepositoriesArgs)
    ).rejects.toThrowError("Method not implemented.");
  });

  it("should throw an error when calling createRepository()", async () => {
    const createRepositoryArgs = <CreateRepositoryArgs>{
      /* provide appropriate arguments */
    };
    await expect(
      gitProvider.createRepository(createRepositoryArgs)
    ).rejects.toThrowError("Method not implemented.");
  });

  it("should throw an error when calling deleteGitOrganization()", async () => {
    await expect(gitProvider.deleteGitOrganization()).rejects.toThrowError(
      "Method not implemented."
    );
  });

  it("should throw an error when calling getOrganization()", async () => {
    await expect(gitProvider.getOrganization()).rejects.toThrowError(
      "Method not implemented."
    );
  });

  it("should throw an error when calling getFile()", async () => {
    const getFileArgs = <GetFileArgs>{
      /* provide appropriate arguments */
    };
    await expect(gitProvider.getFile(getFileArgs)).rejects.toThrowError(
      "Method not implemented."
    );
  });

  it("should throw an error when calling createPullRequestFromFiles()", async () => {
    const createPullRequestFromFilesArgs = <CreatePullRequestFromFilesArgs>{
      /* provide appropriate arguments */
    };
    await expect(
      gitProvider.createPullRequestFromFiles(createPullRequestFromFilesArgs)
    ).rejects.toThrowError("Method not implemented.");
  });

  it("should throw an error when calling getPullRequest()", async () => {
    const getPullRequestArgs = <GitProviderGetPullRequestArgs>{
      /* provide appropriate arguments */
    };
    await expect(
      gitProvider.getPullRequest(getPullRequestArgs)
    ).rejects.toThrowError("Method not implemented.");
  });

  it("should throw an error when calling createPullRequest()", async () => {
    const createPullRequestArgs = <GitProviderCreatePullRequestArgs>{
      /* provide appropriate arguments */
    };
    await expect(
      gitProvider.createPullRequest(createPullRequestArgs)
    ).rejects.toThrowError("Method not implemented.");
  });

  it("should throw an error when calling getBranch()", async () => {
    const args = <GetBranchArgs>{
      /* provide appropriate arguments */
    };
    await expect(gitProvider.getBranch(args)).rejects.toThrowError(
      "Method not implemented."
    );
  });

  it("should throw an error when calling createBranch()", async () => {
    const args = <CreateBranchArgs>{
      /* provide appropriate arguments */
    };
    await expect(gitProvider.createBranch(args)).rejects.toThrowError(
      "Method not implemented."
    );
  });

  it("should throw an error when calling getFirstCommitOnBranch()", async () => {
    const args = <GetBranchArgs>{
      /* provide appropriate arguments */
    };
    await expect(gitProvider.getFirstCommitOnBranch(args)).rejects.toThrowError(
      "Method not implemented."
    );
  });

  it("should throw an error when calling getCloneUrl()", async () => {
    const args = <CloneUrlArgs>{
      /* provide appropriate arguments */
    };
    await expect(gitProvider.getCloneUrl(args)).rejects.toThrowError(
      "Method not implemented."
    );
  });

  it("should throw an error when calling createPullRequestComment()", async () => {
    const args = <CreatePullRequestCommentArgs>{
      /* provide appropriate arguments */
    };
    await expect(
      gitProvider.createPullRequestComment(args)
    ).rejects.toThrowError("Method not implemented.");
  });

  it("should throw an error when calling getAmplicationBotIdentity()", async () => {
    await expect(gitProvider.getAmplicationBotIdentity()).rejects.toThrowError(
      "Method not implemented."
    );
  });
});
