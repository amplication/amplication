import {
  EnumGitOrganizationType,
  GitProviderCreatePullRequestArgs,
  GitProviderGetPullRequestArgs,
  PullRequest,
} from "../../types";
import { AwsCodeCommitService } from "./aws-code-commit.service";
import { MockedLogger } from "@amplication/util/logging/test-utils";
import {
  BranchDoesNotExistException,
  BranchNameExistsException,
  CodeCommitClient,
  CreateBranchCommand,
  CreatePullRequestCommand,
  CreateRepositoryCommand,
  GetBranchCommand,
  GetFileCommand,
  GetPullRequestCommand,
  GetRepositoryCommand,
  ListPullRequestsCommand,
  ListRepositoriesCommand,
  PostCommentForPullRequestCommand,
} from "@aws-sdk/client-codecommit";
import { mockClient } from "aws-sdk-client-mock";

const awsClientMock = mockClient(CodeCommitClient);

describe("AwsCodeCommit", () => {
  let gitProvider: AwsCodeCommitService;
  const awsRegion = "region";

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
          region: awsRegion,
        },
      },
      MockedLogger
    );

    awsClientMock.reset();
  });

  it("should not fail on init()", async () => {
    await gitProvider.init();
  });

  it("should throw an error when calling getGitInstallationUrl()", async () => {
    await expect(gitProvider.getGitInstallationUrl()).rejects.toThrowError(
      "Method not implemented."
    );
  });

  it("should throw an error when calling getCurrentOAuthUser()", async () => {
    await expect(gitProvider.getCurrentOAuthUser()).rejects.toThrowError(
      "Method not implemented."
    );
  });

  it("should throw an error when calling getOAuthTokens()", async () => {
    await expect(gitProvider.getOAuthTokens()).rejects.toThrowError(
      "Method not implemented."
    );
  });

  it("should throw an error when calling getGitGroups()", async () => {
    await expect(gitProvider.getGitGroups()).rejects.toThrowError(
      "Method not implemented."
    );
  });

  describe("getRepository", () => {
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
          repositoryName: getRepositoryArgs.repositoryName,
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
          repositoryName: getRepositoryArgs.repositoryName,
        })
        .resolves({
          repositoryMetadata,
        });

      await expect(
        gitProvider.getRepository(getRepositoryArgs)
      ).rejects.toThrow("Repository example-repo not found");
    });
  });

  describe("getRepositories", () => {
    let getRepositoriesArgs;

    beforeEach(() => {
      getRepositoriesArgs = {
        pagination: {
          page: 1,
          perPage: 10,
        },
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return paginated repositories when repositories exist", async () => {
      const repositories = [
        { repositoryName: "repo1" },
        { repositoryName: "repo2" },
        { repositoryName: "repo3" },
      ];

      awsClientMock
        .on(ListRepositoriesCommand, {
          sortBy: "repositoryName",
          order: "ascending",
        })
        .resolves({ repositories });

      const expectedRepositories = [
        {
          admin: false,
          defaultBranch: "",
          fullName: "repo1",
          name: "repo1",
          private: true,
          url: "",
          groupName: null,
        },
        {
          admin: false,
          defaultBranch: "",
          fullName: "repo2",
          name: "repo2",
          private: true,
          url: "",
          groupName: null,
        },
        {
          admin: false,
          defaultBranch: "",
          fullName: "repo3",
          name: "repo3",
          private: true,
          url: "",
          groupName: null,
        },
      ];

      const result = await gitProvider.getRepositories(getRepositoriesArgs);

      expect(result.pagination).toEqual(getRepositoriesArgs.pagination);
      expect(result.repos).toStrictEqual(expectedRepositories);
      expect(result.total).toBe(repositories.length);
    });

    it("should return paginated repositories based on pagination settings", async () => {
      const repositories = [
        { repositoryName: "repo1", repositoryId: "repo1" },
        { repositoryName: "repo2", repositoryId: "repo2" },
        { repositoryName: "repo3", repositoryId: "repo3" },
        { repositoryName: "repo4", repositoryId: "repo4" },
        { repositoryName: "repo5", repositoryId: "repo5" },
      ];

      awsClientMock
        .on(ListRepositoriesCommand, {
          sortBy: "repositoryName",
          order: "ascending",
        })
        .resolves({ repositories });

      const paginationSettings = {
        page: 2,
        perPage: 2,
      };

      const expectedRepositories = [
        {
          admin: false,
          defaultBranch: "",
          fullName: "repo3",
          name: "repo3",
          private: true,
          url: "",
          groupName: null,
        },
        {
          admin: false,
          defaultBranch: "",
          fullName: "repo4",
          name: "repo4",
          private: true,
          url: "",
          groupName: null,
        },
      ];

      const result = await gitProvider.getRepositories({
        pagination: paginationSettings,
      });

      expect(result.pagination).toEqual(paginationSettings);
      expect(result.repos).toStrictEqual(expectedRepositories);
      expect(result.total).toBe(repositories.length);
    });

    it("should return no repositories when no repositories exist", async () => {
      awsClientMock
        .on(ListRepositoriesCommand, {
          sortBy: "repositoryName",
          order: "ascending",
        })
        .resolves({ repositories: [] });

      const repos = await gitProvider.getRepositories(getRepositoriesArgs);
      expect(repos).toStrictEqual({
        pagination: getRepositoriesArgs.pagination,
        repos: [],
        total: 0,
      });
    });
  });

  describe("createRepository", () => {
    let createRepositoryArgs;

    beforeEach(() => {
      createRepositoryArgs = {
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
        .on(CreateRepositoryCommand, {
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

      const result = await gitProvider.createRepository(createRepositoryArgs);

      expect(result).toStrictEqual(expectedRepository);
    });

    it("should throw an error when repositoryMetadata is not valid", async () => {
      const repositoryMetadata = {};
      awsClientMock
        .on(CreateRepositoryCommand, {
          repositoryName: "example-repo",
        })
        .resolves({
          repositoryMetadata,
        });

      await expect(
        gitProvider.createRepository(createRepositoryArgs)
      ).rejects.toThrow("Repository example-repo not found");
    });
  });

  it("should return always true when calling deleteGitOrganization() since there is nothing to uninstall/delete when an organisation is deleted in AWS CodeCommit.", async () => {
    const result = await gitProvider.deleteGitOrganization();
    expect(result).toBe(true);
  });

  describe("getOrganization", () => {
    it("should return an hardcoded aws codecommit organisation", async () => {
      const result = await gitProvider.getOrganization();

      expect(result).toEqual({
        name: "AWS CodeCommit",
        type: EnumGitOrganizationType.Organization,
        useGroupingForRepositories: false,
      });
    });
  });

  describe("getFile", () => {
    let getFileArgs;

    beforeEach(() => {
      getFileArgs = {
        path: "/path/to/file.txt",
        repositoryName: "example-repo",
        ref: "main",
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return a GitFile when file content and file path exist", async () => {
      const expectedGitFile = {
        content: "file content",
        path: "/path/to/file.txt",
        name: "file",
      };

      awsClientMock
        .on(GetFileCommand, {
          repositoryName: getFileArgs.repositoryName,
          filePath: getFileArgs.path,
          commitSpecifier: getFileArgs.ref,
        })
        .resolves({
          fileContent: Buffer.from("file content"),
          filePath: "/path/to/file.txt",
        });

      const result = await gitProvider.getFile(getFileArgs);

      expect(result).toEqual(expectedGitFile);
    });

    it("should return null when file content or file path do not exist", async () => {
      awsClientMock
        .on(GetFileCommand, {
          commitSpecifier: getFileArgs.ref,
          filePath: getFileArgs.path,
          repositoryName: getFileArgs.repositoryName,
        })
        .resolves({});

      const result = await gitProvider.getFile(getFileArgs);

      expect(result).toBeNull();
    });

    it("should return null when an error occurs", async () => {
      awsClientMock
        .on(GetFileCommand, {
          commitSpecifier: getFileArgs.ref,
          filePath: getFileArgs.path,
          repositoryName: getFileArgs.repositoryName,
        })
        .rejects(new Error("error"));
      const result = await gitProvider.getFile(getFileArgs);

      expect(result).toBeNull();
    });
  });

  it("should throw an error when calling createPullRequestFromFiles()", async () => {
    await expect(gitProvider.createPullRequestFromFiles()).rejects.toThrowError(
      "Method not implemented."
    );
  });

  describe("createPullRequest", () => {
    let createPullRequestArgs: GitProviderCreatePullRequestArgs;
    beforeEach(() => {
      createPullRequestArgs = {
        branchName: "branchName",
        baseBranchName: "defaultBranchName",
        pullRequestTitle: "pullRequestTitle",
        pullRequestBody: "pullRequestBody",
        repositoryName: "repositoryName",
        owner: "user",
      };
    });

    it("should return a new pull request id and url", async () => {
      awsClientMock
        .on(CreatePullRequestCommand, {
          title: createPullRequestArgs.pullRequestTitle,
          description: createPullRequestArgs.pullRequestBody,
          targets: [
            {
              repositoryName: createPullRequestArgs.repositoryName,
              sourceReference: createPullRequestArgs.branchName,
              destinationReference: createPullRequestArgs.baseBranchName,
            },
          ],
        })
        .resolves({
          pullRequest: {
            pullRequestId: "10",
          },
        });

      const result = await gitProvider.createPullRequest(createPullRequestArgs);

      expect(result).toEqual(<PullRequest>{
        number: 10,
        url: `https://${awsRegion}.console.aws.amazon.com/codesuite/codecommit/repositories/${
          createPullRequestArgs.branchName
        }/pull-requests/${10}/details`,
      });
    });

    it("should throw an error when failing in the aws sdk", async () => {
      awsClientMock
        .on(CreatePullRequestCommand, {
          title: createPullRequestArgs.pullRequestTitle,
          description: createPullRequestArgs.pullRequestBody,
          targets: [
            {
              repositoryName: createPullRequestArgs.repositoryName,
              sourceReference: createPullRequestArgs.branchName,
              destinationReference: createPullRequestArgs.baseBranchName,
            },
          ],
        })
        .rejects(new Error("error"));
      await expect(
        gitProvider.createPullRequest(createPullRequestArgs)
      ).rejects.toThrowError("error");
    });

    it("should throw an error when CreatePullRequestCommand returns partial data", async () => {
      awsClientMock
        .on(CreatePullRequestCommand, {
          title: createPullRequestArgs.pullRequestTitle,
          description: createPullRequestArgs.pullRequestBody,
          targets: [
            {
              repositoryName: createPullRequestArgs.repositoryName,
              sourceReference: createPullRequestArgs.branchName,
              destinationReference: createPullRequestArgs.baseBranchName,
            },
          ],
        })
        .resolves({
          pullRequest: {},
        });

      await expect(
        gitProvider.createPullRequest(createPullRequestArgs)
      ).rejects.toThrowError("Failed to create pull request");
    });
  });

  describe("getPullRequest", () => {
    let getPullRequestArgs: GitProviderGetPullRequestArgs;
    beforeEach(() => {
      getPullRequestArgs = {
        branchName: "branchName",
        repositoryName: "repositoryName",
        owner: "user",
      };
    });

    describe("when there are not open pr for selected branch and repository", () => {
      it("should return null", async () => {
        awsClientMock
          .on(ListPullRequestsCommand, {
            repositoryName: getPullRequestArgs.repositoryName,
            pullRequestStatus: "OPEN",
          })
          .resolves({
            pullRequestIds: ["5", "11"],
          })
          .on(GetPullRequestCommand, {
            pullRequestId: "5",
          })
          .resolves({
            pullRequest: {
              pullRequestId: "5",
              pullRequestTargets: [
                {
                  repositoryName: getPullRequestArgs.repositoryName,
                  sourceReference: "branchA",
                },
              ],
            },
          })

          .on(GetPullRequestCommand, {
            pullRequestId: "11",
          })
          .resolves({
            pullRequest: {
              pullRequestId: "11",
              pullRequestTargets: [
                {
                  repositoryName: getPullRequestArgs.repositoryName,
                  sourceReference: "branchB",
                },
              ],
            },
          });

        const result = await gitProvider.getPullRequest(getPullRequestArgs);
        expect(result).toBeNull();
      });
    });

    describe("when there is an open pr for selected branch and repository", () => {
      it("should return the open pull request id and url", async () => {
        awsClientMock
          .on(ListPullRequestsCommand, {
            repositoryName: getPullRequestArgs.repositoryName,
            pullRequestStatus: "OPEN",
          })
          .resolves({
            pullRequestIds: ["5", "10", "11"],
          })
          .on(GetPullRequestCommand, {
            pullRequestId: "5",
          })
          .resolves({
            pullRequest: {
              pullRequestId: "5",
              pullRequestTargets: [
                {
                  repositoryName: getPullRequestArgs.repositoryName,
                  sourceReference: "branchA",
                },
              ],
            },
          })
          .on(GetPullRequestCommand, {
            pullRequestId: "10",
          })
          .resolves({
            pullRequest: {
              pullRequestId: "10",
              pullRequestTargets: [
                {
                  repositoryName: getPullRequestArgs.repositoryName,
                  sourceReference: `refs/heads/${getPullRequestArgs.branchName}`,
                },
              ],
            },
          })
          .on(GetPullRequestCommand, {
            pullRequestId: "11",
          })
          .resolves({
            pullRequest: {
              pullRequestId: "11",
              pullRequestTargets: [
                {
                  repositoryName: getPullRequestArgs.repositoryName,
                  sourceReference: "branchB",
                },
              ],
            },
          });

        const result = await gitProvider.getPullRequest(getPullRequestArgs);

        expect(result).toEqual(<PullRequest>{
          number: 10,
          url: `https://${awsRegion}.console.aws.amazon.com/codesuite/codecommit/repositories/${
            getPullRequestArgs.repositoryName
          }/pull-requests/${10}/details`,
        });
      });
    });
  });

  describe("getBranch", () => {
    let getBranchArgs;

    beforeEach(() => {
      getBranchArgs = {
        repositoryName: "example-repo",
        branchName: "main",
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return the Branch when branch exists", async () => {
      const expectedBranch = {
        name: "main",
        sha: "abcdefg",
      };

      awsClientMock
        .on(GetBranchCommand, {
          repositoryName: getBranchArgs.repositoryName,
          branchName: getBranchArgs.branchName,
        })
        .resolves({
          branch: { branchName: "main", commitId: "abcdefg" },
        });

      const result = await gitProvider.getBranch(getBranchArgs);

      expect(result).toEqual(expectedBranch);
    });

    it("should return null when branch does not exist", async () => {
      awsClientMock
        .on(GetBranchCommand, {
          repositoryName: getBranchArgs.repositoryName,
          branchName: getBranchArgs.branchName,
        })
        .rejects(
          new BranchDoesNotExistException({
            message: "Branch not found",
            $metadata: {},
          })
        );

      const result = await gitProvider.getBranch(getBranchArgs);

      expect(result).toBeNull();
    });
  });

  describe("createBranch", () => {
    let createBranchArgs;

    beforeEach(() => {
      createBranchArgs = {
        repositoryName: "example-repo",
        branchName: "newBranch",
        pointingSha: "123",
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return the Branch when creating the branch successfully", async () => {
      const expectedBranch = {
        name: "newBranch",
        sha: "123",
      };

      awsClientMock
        .on(CreateBranchCommand, {
          repositoryName: createBranchArgs.repositoryName,
          branchName: createBranchArgs.branchName,
        })
        .resolves({});

      const result = await gitProvider.createBranch(createBranchArgs);

      expect(result).toEqual(expectedBranch);
    });

    it("should throw an error when failing to create the branch", async () => {
      awsClientMock
        .on(CreateBranchCommand, {
          repositoryName: createBranchArgs.repositoryName,
          branchName: createBranchArgs.branchName,
        })
        .rejects(
          new BranchNameExistsException({
            message: "Branch name already exists",
            $metadata: {},
          })
        );

      await expect(gitProvider.createBranch(createBranchArgs)).rejects.toThrow(
        `Branch name already exists`
      );
    });
  });

  describe("getCloneUrl", () => {
    let getCloneUrlArgs;

    beforeEach(() => {
      getCloneUrlArgs = {
        repositoryName: "example-repo",
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it.each`
      username        | password         | expectedCloneUrl
      ${null}         | ${null}          | ${"https://example.com/repo.git"}
      ${""}           | ${""}            | ${"https://example.com/repo.git"}
      ${"username"}   | ${"password"}    | ${"https://username:password@example.com/repo.git"}
      ${"user/name?"} | ${"/:pass?word"} | ${"https://user%2Fname%3F:%2F%3Apass%3Fword@example.com/repo.git"}
    `(
      "should return the authenticated clone URL when repository exists for username '$username' and password '$password'",
      async ({ username, password, expectedCloneUrl }) => {
        awsClientMock
          .on(GetRepositoryCommand, {
            repositoryName: getCloneUrlArgs.repositoryName,
          })
          .resolves({
            repositoryMetadata: {
              cloneUrlHttp: "https://example.com/repo.git",
            },
          });

        gitProvider = new AwsCodeCommitService(
          {
            gitCredentials: {
              username,
              password,
            },
            sdkCredentials: {
              accessKeyId: "accessKeyId",
              accessKeySecret: "accessKeySecret",
              region: "region",
            },
          },
          MockedLogger
        );

        const result = await gitProvider.getCloneUrl(getCloneUrlArgs);

        expect(result).toBe(expectedCloneUrl);
      }
    );

    it("should throw an error when repository does not exist", async () => {
      awsClientMock
        .on(GetRepositoryCommand, {
          repositoryName: getCloneUrlArgs.repositoryName,
        })
        .resolves({});

      await expect(gitProvider.getCloneUrl(getCloneUrlArgs)).rejects.toThrow(
        `Repository ${getCloneUrlArgs.repositoryName} not found`
      );
    });
  });

  describe("createPullRequestComment", () => {
    it("should create a pr comment", async () => {
      awsClientMock
        .on(GetPullRequestCommand, {
          pullRequestId: "5",
        })
        .resolves({
          pullRequest: {
            pullRequestId: "5",
            pullRequestTargets: [
              {
                repositoryName: "repositoryName",
                sourceReference: "branchA",
                sourceCommit: "lastCommit",
                destinationCommit: "branchCommit-123",
              },
            ],
          },
        })
        .on(PostCommentForPullRequestCommand, {
          pullRequestId: "5",
          repositoryName: "repositoryName",
          beforeCommitId: "branchCommit-123",
          afterCommitId: "lastCommit",
          content: "beautiful comment",
        });

      await expect(
        gitProvider.createPullRequestComment({
          where: {
            issueNumber: 5,
            repositoryName: "repositoryName",
            owner: "user",
          },
          data: {
            body: "beautiful comment",
          },
        })
      );
    });
  });

  it("should return null getAmplicationBotIdentity()", async () => {
    const res = await gitProvider.getAmplicationBotIdentity();
    expect(res).toBeNull();
  });
});
