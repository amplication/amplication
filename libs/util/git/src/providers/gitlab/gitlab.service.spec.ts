import { ILogger } from "@amplication/util/logging";
import axios from "axios";
import {
  EnumGitOrganizationType,
  GitLabConfiguration,
  OAuthProviderOrganizationProperties,
} from "../../types";
import { GitLabService } from "./gitlab.service";
import { Camelize, ProjectSchema } from "@gitbeaker/rest";

const SAMPLE_PROJECT_1: Partial<Camelize<ProjectSchema>> = {
  id: 1,
  name: "repo1",
  pathWithNamespace: "group1/repo1",
  httpUrlToRepo: "https://gitlab.com/group1/repo1.git",
  namespace: {
    id: 1,
    name: "group1",
    kind: "group",
    path: "",
    fullPath: "",
    avatarUrl: "",
    webUrl: "",
  },
};

const SAMPLE_PROJECT_2: Partial<Camelize<ProjectSchema>> = {
  id: 2,
  name: "repo2",
  pathWithNamespace: "group1/repo2",
  httpUrlToRepo: "https://gitlab.com/group1/repo2.git",
  namespace: {
    id: 1,
    name: "group1",
    kind: "group",
    path: "",
    fullPath: "",
    avatarUrl: "",
    webUrl: "",
  },
};

const gitbeakerMock = {
  Users: {
    showCurrentUser: jest.fn().mockResolvedValue({
      avatar_url: "http://avatar.url",
      username: "testUser",
      id: 1,
    }),
  },
  Namespaces: {
    all: jest.fn().mockResolvedValue({
      data: [
        { id: 1, full_path: "group1", kind: "group" },
        { id: 2, full_path: "group2", kind: "group" },
      ],
      paginationInfo: {
        total: 100,
        perPage: 10,
      },
    }),
    show: jest.fn().mockResolvedValue({
      id: 1,
      full_path: "group1",
      kind: "group",
    }),
  },
  RepositoryFiles: {
    show: jest.fn().mockResolvedValue({
      file_name: "README.md",
      content: "file content",
    }),
  },
  Repositories: {
    allRepositoryTrees: jest.fn().mockResolvedValue([
      {
        id: 1,
        name: "file1",
        type: "blob",
        path: "src/file1",
      },
      {
        id: 2,
        name: "file2",
        type: "blob",
        path: "src/file2",
      },
    ]),
  },
  Commits: {
    all: jest.fn().mockResolvedValue([
      {
        id: "sha",
        short_id: "sha",
        created_at: "2021-01-01T00:00:00.000Z",
        parent_ids: [],
        title: "Initial commit",
        message: "Initial commit",
        author_name: "Author",
        author_email: "author@example.com",
        authored_date: "2021-01-01T00:00:00.000Z",
        committer_name: "Committer",
        committer_email: "committer@example.com",
        committed_date: "2021-01-01T00:00:00.000Z",
      },
    ]),
  },
  Projects: {
    create: jest.fn().mockResolvedValue(SAMPLE_PROJECT_1),
    show: jest.fn().mockResolvedValue(SAMPLE_PROJECT_1),
    all: jest.fn().mockResolvedValue({
      paginationInfo: {
        total: 100,
        perPage: 10,
        page: 1,
      },
      data: [SAMPLE_PROJECT_1, SAMPLE_PROJECT_2],
    }),
  },
  Branches: {
    create: jest.fn().mockResolvedValue({
      name: "new-branch",
      commit: {
        id: "sha",
      },
    }),
    show: jest.fn().mockResolvedValue({
      name: "main",
      commit: {
        id: "sha",
      },
    }),
  },
  MergeRequestNotes: {
    create: jest.fn().mockResolvedValue({}),
  },
  MergeRequests: {
    create: jest.fn().mockResolvedValue({
      webUrl: "http://gitlab.com/group1/repo1/merge_requests/1",
      iid: 1,
    }),
    all: jest.fn().mockResolvedValue([
      {
        webUrl: "http://gitlab.com/group1/repo1/merge_requests/1",
        iid: 1,
      },
    ]),
  },
};

jest.mock("@gitbeaker/rest", () => {
  return {
    Gitlab: jest.fn().mockImplementation(() => gitbeakerMock),
  };
});

jest.mock("axios");

describe("GitLabService", () => {
  let service: GitLabService;
  let logger: ILogger;
  let providerOrganizationProperties: OAuthProviderOrganizationProperties;
  let providerConfiguration: GitLabConfiguration;

  beforeEach(() => {
    logger = {
      child: jest.fn().mockReturnThis(),
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as unknown as ILogger;

    providerOrganizationProperties = {
      accessToken: "testAccessToken",
      refreshToken: "testRefreshToken",
      expiresAt: Date.now() + 3600 * 1000,
      tokenType: "Bearer",
      scopes: ["api"],
      username: "testUser",
      links: {
        avatar: {
          href: "http://avatar.url",
          name: "avatar",
        },
      },
      uuid: "uuid",
      displayName: "displayName",
      useGroupingForRepositories: true,
    };

    providerConfiguration = {
      clientId: "testClientId",
      clientSecret: "testClientSecret",
      redirectUri: "http://localhost/callback",
    };

    service = new GitLabService(
      providerOrganizationProperties,
      providerConfiguration,
      logger
    );
  });

  it("should initialize the service", async () => {
    await service.init();
    expect(logger.info).toHaveBeenCalledWith("GitLabService initialized");
  });

  it("should get Git installation URL", async () => {
    const url = await service.getGitInstallationUrl("workspaceId");
    expect(url).toBe(
      "https://gitlab.com/oauth/authorize?client_id=testClientId&redirect_uri=http://localhost/callback&response_type=code&scope=api&state=workspaceId"
    );
  });

  it("should get OAuth tokens", async () => {
    const axiosPostMock = axios.post as jest.Mock;
    axiosPostMock.mockResolvedValue({
      data: {
        access_token: "newAccessToken",
        refresh_token: "newRefreshToken",
        token_type: "Bearer",
        expires_in: 3600,
        scope: "api",
        created_at: Date.now() / 1000,
      },
    });

    const tokens = await service.getOAuthTokens("authorizationCode");
    expect(tokens.accessToken).toBe("newAccessToken");
    expect(tokens.refreshToken).toBe("newRefreshToken");
    expect(logger.info).toHaveBeenCalledWith(
      "GitLabService: Obtained new OAuth tokens"
    );
  });

  it("should refresh access token if needed", async () => {
    const axiosPostMock = axios.post as jest.Mock;
    axiosPostMock.mockResolvedValue({
      data: {
        access_token: "refreshedAccessToken",
        refresh_token: "refreshedRefreshToken",
        token_type: "Bearer",
        expires_in: 3600,
        scope: "api",
        created_at: Date.now() / 1000,
      },
    });

    service["auth"].expiresAt = Date.now() - 1000; // Expired token
    const tokens = await service.refreshAccessTokenIfNeeded();
    expect(tokens.accessToken).toBe("refreshedAccessToken");
    expect(tokens.refreshToken).toBe("refreshedRefreshToken");
    expect(logger.info).toHaveBeenCalledWith(
      "GitLabService: Refreshed OAuth tokens"
    );
  });

  it("should get current OAuth user", async () => {
    const user = await service.getCurrentOAuthUser("accessToken");
    expect(user.username).toBe("testUser");
    expect(logger.info).toHaveBeenCalledWith("GitLabService getCurrentUser");
  });

  it("should get Git groups", async () => {
    const groups = await service.getGitGroups();
    expect(groups.groups.length).toBe(2);
    expect(logger.info).toHaveBeenCalledWith("GitLabService getGitGroups");
  });

  it("should get organization", async () => {
    const organization = await service.getOrganization();
    expect(organization.name).toBe("testUser");
    expect(logger.info).toHaveBeenCalledWith("GitLabService getOrganization");
  });

  it("should get repository", async () => {
    const repository = await service.getRepository({
      groupName: "group1",
      repositoryName: "repo1",
      owner: "testUser",
    });
    expect(repository.name).toBe("repo1");
    expect(repository.groupName).toBe("group1");
  });

  it("should get repositories", async () => {
    const repositories = await service.getRepositories({
      groupName: "group1",
      pagination: { perPage: 10, page: 1 },
    });
    expect(repositories.repos.length).toBeGreaterThan(0);
  });

  it("should create repository", async () => {
    const repository = await service.createRepository({
      groupName: "group1",
      repositoryName: "repo1",
      isPrivate: false,
      gitOrganization: {
        name: "testOrg",
        type: EnumGitOrganizationType.Organization,
        useGroupingForRepositories: true,
      },
      owner: "testUser",
    });
    expect(repository.name).toBe("repo1");
  });

  it("should get file", async () => {
    const file = await service.getFile({
      repositoryName: "repo1",
      path: "README.md",
      ref: "main",
      repositoryGroupName: "group1",
      owner: "testUser",
    });
    expect(file?.name).toBe("README.md");
    expect(logger.info).toHaveBeenCalledWith("GitLabService getFile");
  });

  it("should get folder content", async () => {
    const folderContent = await service.getFolderContent({
      repositoryName: "repo1",
      path: "src",
      ref: "main",
      repositoryGroupName: "group1",
      owner: "testUser",
    });
    expect(folderContent.content.length).toBeGreaterThan(0);
  });

  it("should create pull request", async () => {
    const pullRequest = await service.createPullRequest({
      repositoryName: "repo1",
      branchName: "feature-branch",
      baseBranchName: "main",
      pullRequestTitle: "New Feature",
      pullRequestBody: "Description of the new feature",
      repositoryGroupName: "group1",
      owner: "testUser",
    });
    expect(pullRequest?.url).toContain("merge_requests");
  });

  it("should get pull request", async () => {
    const pullRequest = await service.getPullRequest({
      repositoryName: "repo1",
      branchName: "feature-branch",
      repositoryGroupName: "group1",
      owner: "testUser",
    });
    expect(pullRequest?.url).toContain("merge_requests");
  });

  it("should create branch", async () => {
    const branch = await service.createBranch({
      repositoryName: "repo1",
      branchName: "new-branch",
      baseBranchName: "main",
      repositoryGroupName: "group1",
      owner: "testUser",
      pointingSha: "sha",
    });
    expect(branch.name).toBe("new-branch");
  });

  it("should get branch", async () => {
    const branch = await service.getBranch({
      repositoryName: "repo1",
      branchName: "main",
      repositoryGroupName: "group1",
      owner: "testUser",
    });
    expect(branch?.name).toBe("main");
  });

  it("should get first commit on branch", async () => {
    const commit = await service.getFirstCommitOnBranch({
      repositoryName: "repo1",
      branchName: "main",
      repositoryGroupName: "group1",
      owner: "testUser",
    });
    expect(commit?.sha).toBeDefined();
  });

  it("should get clone URL", async () => {
    const cloneUrl = await service.getCloneUrl({
      repositoryName: "repo1",
      repositoryGroupName: "group1",
      owner: "testUser",
    });
    expect(cloneUrl).toContain("oauth2");
  });

  it("should create pull request comment", async () => {
    await service.createPullRequestComment({
      data: { body: "Nice work!" },
      where: {
        repositoryName: "repo1",
        issueNumber: 1,
        repositoryGroupName: "group1",
        owner: "testUser",
      },
    });
  });

  it("should handle error when getting repository", async () => {
    gitbeakerMock.Projects.show.mockRejectedValueOnce(new Error("Not Found"));
    await expect(
      service.getRepository({
        groupName: "group1",
        repositoryName: "repo1",
        owner: "testUser",
      })
    ).rejects.toThrow("Not Found");
  });

  it("should handle error when creating repository", async () => {
    gitbeakerMock.Projects.create.mockRejectedValueOnce(new Error("Conflict"));
    await expect(
      service.createRepository({
        groupName: "group1",
        repositoryName: "repo1",
        isPrivate: false,
        gitOrganization: {
          name: "testOrg",
          type: EnumGitOrganizationType.Organization,
          useGroupingForRepositories: true,
        },
        owner: "testUser",
      })
    ).rejects.toThrow("Conflict");
  });

  it("should handle error when getting file", async () => {
    gitbeakerMock.RepositoryFiles.show.mockRejectedValueOnce(
      new Error("Not Found")
    );
    await expect(
      service.getFile({
        repositoryName: "repo1",
        path: "README.md",
        ref: "main",
        repositoryGroupName: "group1",
        owner: "testUser",
      })
    ).rejects.toThrow("Not Found");
  });

  it("should handle error when getting folder content", async () => {
    gitbeakerMock.Repositories.allRepositoryTrees.mockRejectedValueOnce(
      new Error("Not Found")
    );
    await expect(
      service.getFolderContent({
        repositoryName: "repo1",
        path: "src",
        ref: "main",
        repositoryGroupName: "group1",
        owner: "testUser",
      })
    ).rejects.toThrow("Not Found");
  });

  it("should handle error when creating pull request", async () => {
    gitbeakerMock.MergeRequests.create.mockRejectedValueOnce(
      new Error("Conflict")
    );
    await expect(
      service.createPullRequest({
        repositoryName: "repo1",
        branchName: "feature-branch",
        baseBranchName: "main",
        pullRequestTitle: "New Feature",
        pullRequestBody: "Description of the new feature",
        repositoryGroupName: "group1",
        owner: "testUser",
      })
    ).rejects.toThrow("Conflict");
  });

  it("should handle error when getting pull request", async () => {
    gitbeakerMock.MergeRequests.all.mockRejectedValueOnce(
      new Error("Not Found")
    );
    await expect(
      service.getPullRequest({
        repositoryName: "repo1",
        branchName: "feature-branch",
        repositoryGroupName: "group1",
        owner: "testUser",
      })
    ).rejects.toThrow("Not Found");
  });

  it("should handle error when creating branch", async () => {
    gitbeakerMock.Branches.create.mockRejectedValueOnce(new Error("Conflict"));
    await expect(
      service.createBranch({
        repositoryName: "repo1",
        branchName: "new-branch",
        baseBranchName: "main",
        repositoryGroupName: "group1",
        owner: "testUser",
        pointingSha: "sha",
      })
    ).rejects.toThrow("Conflict");
  });

  it("should handle error when getting branch", async () => {
    gitbeakerMock.Branches.show.mockRejectedValueOnce(new Error("Not Found"));
    await expect(
      service.getBranch({
        repositoryName: "repo1",
        branchName: "main",
        repositoryGroupName: "group1",
        owner: "testUser",
      })
    ).rejects.toThrow("Not Found");
  });

  it("should handle error when getting first commit on branch", async () => {
    gitbeakerMock.Commits.all.mockRejectedValueOnce(new Error("Not Found"));
    await expect(
      service.getFirstCommitOnBranch({
        repositoryName: "repo1",
        branchName: "main",
        repositoryGroupName: "group1",
        owner: "testUser",
      })
    ).rejects.toThrow("Not Found");
  });

  it("should handle error when getting clone URL", async () => {
    gitbeakerMock.Projects.show.mockRejectedValueOnce(new Error("Not Found"));
    await expect(
      service.getCloneUrl({
        repositoryName: "repo1",
        repositoryGroupName: "group1",
        owner: "testUser",
      })
    ).rejects.toThrow("Not Found");
  });

  it("should handle error when creating pull request comment", async () => {
    gitbeakerMock.MergeRequestNotes.create.mockRejectedValueOnce(
      new Error("Not Found")
    );
    await expect(
      service.createPullRequestComment({
        data: { body: "Nice work!" },
        where: {
          repositoryName: "repo1",
          issueNumber: 1,
          repositoryGroupName: "group1",
          owner: "testUser",
        },
      })
    ).rejects.toThrow("Not Found");
  });
});
