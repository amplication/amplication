import { Octokit } from "octokit";
import { ILogger } from "@amplication/util/logging";
import { GithubService } from "./github.service";
import {
  GitHubProviderOrganizationProperties,
  GitHubConfiguration,
  EnumGitOrganizationType,
} from "../../types";

jest.mock("octokit");

describe("GithubService", () => {
  let githubService: GithubService;
  let mockLogger: ILogger;
  let mockOctokit: jest.Mocked<Octokit>;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as ILogger;

    mockOctokit = new Octokit() as jest.Mocked<Octokit>;
    mockOctokit.graphql = jest.fn() as unknown as jest.MockedFunction<
      typeof mockOctokit.graphql
    >;
    mockOctokit.rest = {
      repos: {
        get: jest.fn(),
        getContent: jest.fn(),
        createInOrg: jest.fn(),
      },
      pulls: {
        create: jest.fn(),
      },
      git: {
        getRef: jest.fn(),
        createRef: jest.fn(),
      },
    } as unknown as jest.Mocked<typeof mockOctokit.rest>;

    const providerOrganizationProperties: GitHubProviderOrganizationProperties =
      {
        installationId: "123",
      };

    const providerConfiguration: GitHubConfiguration = {
      appId: "appId",
      privateKey: "privateKey",
      installationUrl: "installationUrl",
      clientId: "clientId",
      clientSecret: "clientSecret",
    };

    githubService = new GithubService(
      providerOrganizationProperties,
      providerConfiguration,
      mockLogger
    );

    githubService["octokit"] = mockOctokit;
  });

  describe("init", () => {
    it("should initialize the service", async () => {
      const getInstallationOctokitSpy = jest
        .spyOn(githubService as any, "getInstallationOctokit")
        .mockResolvedValue(mockOctokit);

      await githubService.init();

      expect(getInstallationOctokitSpy).toHaveBeenCalledWith("123");
    });

    it("should throw an error if configuration is missing", async () => {
      githubService["providerConfiguration"].appId = "";
      await expect(githubService.init()).rejects.toThrow(
        "Missing Github configuration"
      );
    });
  });

  describe("getCloneUrl", () => {
    it("should return the clone URL", async () => {
      const getTokenSpy = jest
        .spyOn(githubService as any, "getToken")
        .mockResolvedValue("token");
      const cloneUrl = await githubService.getCloneUrl({
        owner: "owner",
        repositoryName: "repo",
      });

      expect(getTokenSpy).toHaveBeenCalled();
      expect(cloneUrl).toBe(
        "https://x-access-token:token@github.com/owner/repo.git"
      );
    });
  });

  describe("getAmplicationBotIdentity", () => {
    it("should return the bot identity", async () => {
      mockOctokit.graphql.mockResolvedValue({
        viewer: { id: "id", login: "login" },
      });

      const bot = await githubService.getAmplicationBotIdentity();

      expect(bot).toEqual({
        id: "id",
        login: "login",
        gitAuthor: "login <\\d+\\+login@user\\.noreply\\.github\\.com>",
      });
    });
  });

  describe("getRepository", () => {
    it("should return the repository details", async () => {
      (mockOctokit.rest.repos.get as unknown as jest.Mock).mockResolvedValue({
        data: {
          permissions: { admin: true },
          url: "url",
          private: true,
          name: "repo",
          full_name: "owner/repo",
          default_branch: "main",
        },
      } as any);

      const repo = await githubService.getRepository({
        owner: "owner",
        repositoryName: "repo",
      });

      expect(repo).toEqual({
        defaultBranch: "main",
        fullName: "owner/repo",
        name: "repo",
        private: true,
        url: "url",
      });
    });
  });

  describe("createRepository", () => {
    it("should create a new repository", async () => {
      jest
        .spyOn(githubService as any, "isRepositoryInOrganizationRepositories")
        .mockResolvedValue(false);

      (
        mockOctokit.rest.repos.createInOrg as unknown as jest.Mock
      ).mockResolvedValue({
        data: {
          name: "repo",
          html_url: "url",
          private: true,
          full_name: "owner/repo",
          default_branch: "main",
        },
      } as any);

      const repo = await githubService.createRepository({
        gitOrganization: {
          type: EnumGitOrganizationType.Organization,
          name: "organization",
          useGroupingForRepositories: false,
        },
        owner: "owner",
        repositoryName: "repo",
        isPrivate: true,
      });

      expect(repo).toEqual({
        name: "repo",
        url: "url",
        private: true,
        fullName: "owner/repo",
        defaultBranch: "main",
      });
    });

    it("should throw an error if repository already exists", async () => {
      jest
        .spyOn(githubService as any, "isRepositoryInOrganizationRepositories")
        .mockResolvedValue(true);

      await expect(
        githubService.createRepository({
          gitOrganization: {
            type: EnumGitOrganizationType.Organization,
            name: "organization",
            useGroupingForRepositories: false,
          },
          owner: "owner",
          repositoryName: "repo",
          isPrivate: true,
        })
      ).rejects.toThrow("Repository already exists.");
    });
  });

  describe("getFolderContent", () => {
    it("should return folder content", async () => {
      (
        mockOctokit.rest.repos.getContent as unknown as jest.Mock
      ).mockResolvedValue({
        data: [
          { name: "file1", path: "path1", type: "file" },
          { name: "file2", path: "path2", type: "dir" },
        ],
      } as any);

      const content = await githubService.getFolderContent({
        owner: "owner",
        repositoryName: "repo",
        path: "path",
        ref: "ref",
      });

      expect(content).toEqual({
        content: [
          { name: "file1", path: "path1", type: "File" },
          { name: "file2", path: "path2", type: "Dir" },
        ],
      });
    });

    it("should throw an error if path is not a directory", async () => {
      (
        mockOctokit.rest.repos.getContent as unknown as jest.Mock
      ).mockResolvedValue({
        data: { name: "file", path: "path", type: "file" },
      } as any);

      await expect(
        githubService.getFolderContent({
          owner: "owner",
          repositoryName: "repo",
          path: "path",
          ref: "ref",
        })
      ).rejects.toThrow("The specified path is not a directory");
    });
  });

  describe("getFile", () => {
    it("should return file content", async () => {
      (
        mockOctokit.rest.repos.getContent as unknown as jest.Mock
      ).mockResolvedValue({
        data: {
          name: "file",
          path: "path",
          type: "file",
          content: Buffer.from("content").toString("base64"),
        },
      } as any);

      const file = await githubService.getFile({
        owner: "owner",
        repositoryName: "repo",
        path: "path",
        ref: "ref",
      });

      expect(file).toEqual({
        content: "content",
        name: "file",
        path: "path",
      });
    });

    it("should return null if file content is not available", async () => {
      (
        mockOctokit.rest.repos.getContent as unknown as jest.Mock
      ).mockResolvedValue({
        data: { name: "file", path: "path", type: "file" },
      } as any);

      const file = await githubService.getFile({
        owner: "owner",
        repositoryName: "repo",
        path: "path",
        ref: "ref",
      });

      expect(file).toBeNull();
    });
  });

  describe("createPullRequestFromFiles", () => {
    it("should create a pull request from files", async () => {
      const createPullRequestMock = jest.fn().mockResolvedValue({
        data: { html_url: "url" },
      });

      const octokitWithPluginsMock = jest.fn().mockReturnValue({
        createPullRequest: createPullRequestMock,
      });

      Octokit.plugin = jest.fn().mockReturnValue(octokitWithPluginsMock);

      jest
        .spyOn(githubService as any, "getInstallationAuthToken")
        .mockResolvedValue("token");

      const url = await githubService.createPullRequestFromFiles({
        owner: "owner",
        repositoryName: "repo",
        pullRequestTitle: "title",
        pullRequestBody: "body",
        branchName: "branch",
        files: [
          {
            path: "path",
            content: "content",
            skipIfExists: false,
            deleted: false,
          },
        ],
        commitMessage: "message",
      });

      expect(url).toBe("url");
    });

    it("should throw an error if pull request creation fails", async () => {
      const createPullRequestMock = jest.fn().mockResolvedValue(null);

      const octokitWithPluginsMock = jest.fn().mockReturnValue({
        createPullRequest: createPullRequestMock,
      });

      Octokit.plugin = jest.fn().mockReturnValue(octokitWithPluginsMock);

      jest
        .spyOn(githubService as any, "getInstallationAuthToken")
        .mockResolvedValue("token");

      await expect(
        githubService.createPullRequestFromFiles({
          owner: "owner",
          repositoryName: "repo",
          pullRequestTitle: "title",
          pullRequestBody: "body",
          branchName: "branch",
          files: [
            {
              path: "path",
              content: "content",
              skipIfExists: false,
              deleted: false,
            },
          ],
          commitMessage: "message",
        })
      ).rejects.toThrow("We had a problem creating the pull request");
    });
  });

  describe("getPullRequest", () => {
    it("should return the pull request details", async () => {
      mockOctokit.graphql.mockResolvedValue({
        repository: {
          ref: {
            associatedPullRequests: {
              edges: [
                {
                  node: {
                    url: "url",
                    number: 1,
                  },
                },
              ],
            },
          },
        },
      });

      const pullRequest = await githubService.getPullRequest({
        owner: "owner",
        repositoryName: "repo",
        branchName: "branch",
      });

      expect(pullRequest).toEqual({
        url: "url",
        number: 1,
      });
    });

    it("should return null if no pull request is found", async () => {
      mockOctokit.graphql.mockResolvedValue({
        repository: {
          ref: {
            associatedPullRequests: {
              edges: [],
            },
          },
        },
      });

      const pullRequest = await githubService.getPullRequest({
        owner: "owner",
        repositoryName: "repo",
        branchName: "branch",
      });

      expect(pullRequest).toBeNull();
    });
  });

  describe("createPullRequest", () => {
    it("should create a pull request", async () => {
      (mockOctokit.rest.pulls.create as unknown as jest.Mock).mockResolvedValue(
        {
          data: { html_url: "url", number: 1 },
        } as any
      );

      const pullRequest = await githubService.createPullRequest({
        owner: "owner",
        repositoryName: "repo",
        branchName: "branch",
        pullRequestTitle: "title",
        pullRequestBody: "body",
        baseBranchName: "main",
      });

      expect(pullRequest).toEqual({
        url: "url",
        number: 1,
      });
    });

    it("should throw an error if no changes are found", async () => {
      (mockOctokit.rest.pulls.create as unknown as jest.Mock).mockRejectedValue(
        {
          status: 422,
          response: { url: "https://api.github.com/repos/owner/repo/pulls/1" },
        }
      );

      await expect(
        githubService.createPullRequest({
          owner: "owner",
          repositoryName: "repo",
          branchName: "branch",
          pullRequestTitle: "title",
          pullRequestBody: "body",
          baseBranchName: "main",
        })
      ).rejects.toThrow("No changes in the current pull request");
    });
  });

  describe("getBranch", () => {
    it("should return branch details", async () => {
      (mockOctokit.rest.git.getRef as unknown as jest.Mock).mockResolvedValue({
        data: { object: { sha: "sha" }, url: "url" },
      } as any);

      const branch = await githubService.getBranch({
        owner: "owner",
        repositoryName: "repo",
        branchName: "branch",
      });

      expect(branch).toEqual({
        sha: "sha",
        name: "branch",
      });
    });

    it("should return null if branch is not found", async () => {
      (mockOctokit.rest.git.getRef as unknown as jest.Mock).mockRejectedValue(
        new Error("Not found")
      );

      const branch = await githubService.getBranch({
        owner: "owner",
        repositoryName: "repo",
        branchName: "branch",
      });

      expect(branch).toBeNull();
    });
  });

  describe("createBranch", () => {
    it("should create a new branch", async () => {
      (mockOctokit.rest.git.getRef as unknown as jest.Mock).mockResolvedValue({
        data: { object: { sha: "baseSha" } },
      } as any);

      (
        mockOctokit.rest.git.createRef as unknown as jest.Mock
      ).mockResolvedValue({
        data: { object: { sha: "sha" } },
      } as any);

      const branch = await githubService.createBranch({
        owner: "owner",
        repositoryName: "repo",
        branchName: "branch",
        baseBranchName: "main",
        pointingSha: "sha",
      });

      expect(branch).toEqual({
        name: "branch",
        sha: "sha",
      });
    });
  });

  describe("getFirstCommitOnBranch", () => {
    it("should return the first commit on the branch", async () => {
      mockOctokit.graphql.mockResolvedValue({
        repository: {
          ref: {
            target: {
              history: {
                nodes: [{ oid: "sha", url: "url" }],
                totalCount: 1,
                pageInfo: { endCursor: "cursor" },
              },
            },
          },
        },
      });

      const commit = await githubService.getFirstCommitOnBranch({
        owner: "owner",
        repositoryName: "repo",
        branchName: "branch",
      });

      expect(commit).toEqual({
        sha: "sha",
      });
    });

    it("should return null if no commit is found", async () => {
      mockOctokit.graphql.mockResolvedValue({
        repository: null,
      });

      const commit = await githubService.getFirstCommitOnBranch({
        owner: "owner",
        repositoryName: "repo",
        branchName: "branch",
      });

      expect(commit).toBeNull();
    });
  });
});
