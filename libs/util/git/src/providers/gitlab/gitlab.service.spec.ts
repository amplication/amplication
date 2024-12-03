import { ILogger } from "@amplication/util/logging";
import axios from "axios";
import {
  GitLabConfiguration,
  OAuthProviderOrganizationProperties,
} from "../../types";
import { GitLabService } from "./gitlab.service";

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

  // Add more tests for other methods as needed
});
