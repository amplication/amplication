import {
  CloneUrlArgs,
  CreateBranchArgs,
  CreatePullRequestCommentArgs,
  CreatePullRequestFromFilesArgs,
  CreateRepositoryArgs,
  GetBranchArgs,
  GetFileArgs,
  GetRepositoriesArgs,
  GitProviderCreatePullRequestArgs,
  GitProviderGetPullRequestArgs,
} from "../../types";
import { AwsCodeCommitService } from "./aws-code-commit.service";
import { MockedLogger } from "@amplication/util/logging/test-utils";
import {
  CodeCommitClient,
  GetRepositoryCommand,
} from "@aws-sdk/client-codecommit";
import { mockClient } from "aws-sdk-client-mock";

describe("AwsCodeCommit", () => {
  let gitProvider: AwsCodeCommitService;

  beforeEach(() => {
    gitProvider = new AwsCodeCommitService(
      {
        gitCredentials: {
          username: "username",
          password: "password",
        },
        sdkCredentials: {
          accessKeyId: "accessKeyId",
          accessKeySecret: "accessKeySecret",
          region: "region",
        },
      },
      MockedLogger
    );
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

  describe("getRepository", () => {
    const awsClientMock = mockClient(CodeCommitClient);
    let getRepositoryArgs;

    beforeEach(() => {
      getRepositoryArgs = {
        repositoryName: "example-repo",
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return a RemoteGitRepository when repositoryMetadata is valid", async () => {
      const repositoryMetadata = {
        defaultBranch: "main",
        repositoryName: "example-repo",
        cloneUrlHttp: "https://github.com/example/example-repo.git",
      };
      awsClientMock
        .on(GetRepositoryCommand, {
          repositoryName: "example-repo",
        })
        .resolves({
          repositoryMetadata,
        });

      const expectedRepository = {
        admin: false,
        defaultBranch: "main",
        fullName: "example-repo",
        name: "example-repo",
        private: true,
        url: "https://github.com/example/example-repo.git",
        groupName: null,
      };

      const result = await gitProvider.getRepository(getRepositoryArgs);

      expect(result).toStrictEqual(expectedRepository);
    });

    it("should throw an error when repositoryMetadata is not valid", async () => {
      const repositoryMetadata = {};
      awsClientMock
        .on(GetRepositoryCommand, {
          repositoryName: "example-repo",
        })
        .resolves({
          repositoryMetadata,
        });

      await expect(
        gitProvider.getRepository(getRepositoryArgs)
      ).rejects.toThrow("Repository example-repo not found");
    });
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
