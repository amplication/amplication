import { DownloadPrivatePluginsRequest } from "@amplication/schema-registry";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { copy, pathExists } from "fs-extra";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { join } from "path";
import { Env } from "../env";
import { PrivatePluginService } from "./private-plugin.service";
import { EnumGitProvider } from "@amplication/util/git";

jest.mock("@amplication/util/git");
jest.mock("fs-extra");
jest.mock("node:fs");
jest.mock("path");
jest.mock("node:fs/promises");

const loggerErrorMock = jest.fn();

describe("PrivatePluginService", () => {
  let service: PrivatePluginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrivatePluginService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const env = {
                [Env.BITBUCKET_CLIENT_ID]: "bitbucketClientId",
                [Env.BITBUCKET_CLIENT_SECRET]: "bitbucketClientSecret",
                [Env.GITLAB_CLIENT_ID]: "gitLabClientId",
                [Env.GITLAB_CLIENT_SECRET]: "gitLabClientSecret",
                [Env.GITLAB_REDIRECT_URI]: "gitLabRedirectUri",
                [Env.AZURE_DEVOPS_CLIENT_ID]: "azureDevopsClientId",
                [Env.AZURE_DEVOPS_CLIENT_SECRET]: "azureDevopsClientSecret",
                [Env.AZURE_DEVOPS_REDIRECT_URI]: "azureDevopsRedirectUri",
                [Env.AZURE_DEVOPS_TENANT_ID]: "azureDevopsTenantId",
                [Env.GITHUB_APP_CLIENT_ID]: "githubClientId",
                [Env.GITHUB_APP_CLIENT_SECRET]: "githubClientSecret",
                [Env.GITHUB_APP_APP_ID]: "githubAppId",
                [Env.GITHUB_APP_PRIVATE_KEY]: "githubAppPrivateKey",
                [Env.GITHUB_APP_INSTALLATION_URL]: "githubAppInstallationUrl",
                [Env.CLONES_FOLDER]: "/clones",
                [Env.DSG_ASSETS_FOLDER]: "/assets",
              };
              return env[key];
            }),
          },
        },
        {
          provide: AmplicationLogger,
          useValue: {
            child: jest.fn().mockReturnThis(),
            error: loggerErrorMock,
          },
        },
        {
          provide: KafkaProducerService,
          useValue: {
            emitMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PrivatePluginService>(PrivatePluginService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("downloadPrivatePlugins", () => {
    it("should download plugins from multiple repositories", async () => {
      const request: DownloadPrivatePluginsRequest.Value = {
        resourceId: "resourceId",
        buildId: "buildId",
        repositoryPlugins: [
          {
            gitProvider: EnumGitProvider.Github,
            gitProviderProperties: undefined,
            gitOrganizationName: "org",
            gitRepositoryName: "repo",
            repositoryGroupName: "group",
            baseBranchName: "main",
            pluginsToDownload: [
              {
                pluginId: "plugin1",
                pluginVersion: "1.0.0",
              },
            ],
          },
        ],
      };

      jest
        .spyOn(service, "downloadPrivatePluginsFromSingleRepo")
        .mockResolvedValue({
          pluginPaths: ["/path/to/plugin1", "/path/to/plugin2"],
        });

      const result = await service.downloadPrivatePlugins(request);

      expect(result.pluginPaths).toEqual([
        "/path/to/plugin1",
        "/path/to/plugin2",
      ]);
      expect(
        service.downloadPrivatePluginsFromSingleRepo
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("copyPluginFilesToDsgAssetsDir", () => {
    it("should copy plugin files to DSG assets directory", async () => {
      const pluginPaths = ["/path/to/plugin1", "/path/to/plugin2"];
      const resourceId = "resourceId";
      const buildId = "buildId";
      const dsgAssetsPath = join(
        "/assets",
        `${resourceId}-${buildId}`,
        "private-plugins"
      );

      (pathExists as jest.Mock).mockResolvedValue(true);
      (copy as jest.Mock).mockResolvedValue(undefined);

      const result = await service.copyPluginFilesToDsgAssetsDir(
        pluginPaths,
        resourceId,
        buildId
      );

      expect(result.newPluginPaths).toEqual([
        join(dsgAssetsPath, "plugin1"),
        join(dsgAssetsPath, "plugin2"),
      ]);
      expect(copy).toHaveBeenCalledTimes(2);
    });

    it("should throw an error if plugin path does not exist", async () => {
      const pluginPaths = ["/path/to/plugin1"];
      const resourceId = "resourceId";
      const buildId = "buildId";

      (pathExists as jest.Mock).mockResolvedValue(false);

      await expect(
        service.copyPluginFilesToDsgAssetsDir(pluginPaths, resourceId, buildId)
      ).rejects.toThrow(`Can't find plugin 'plugin1' in the source repository`);
    });
  });

  describe("cleanupPluginsDir", () => {
    it("should clean up plugin directories", async () => {
      const cleanupPaths = ["/path/to/plugin1", "/path/to/plugin2"];

      (existsSync as jest.Mock).mockReturnValue(true);
      (rm as jest.Mock).mockResolvedValue(undefined);

      await service.cleanupPluginsDir(cleanupPaths);

      expect(rm).toHaveBeenCalledTimes(2);
    });

    it("should log an error if cleanup fails", async () => {
      const cleanupPaths = ["/path/to/plugin1"];
      const error = new Error("Failed to delete");

      (existsSync as jest.Mock).mockReturnValue(true);
      (rm as unknown as jest.Mock).mockRejectedValue(error);

      await service.cleanupPluginsDir(cleanupPaths);

      expect(loggerErrorMock).toHaveBeenCalledWith(
        "Failed to delete private plugins repository dir",
        error,
        { repositoryDir: "/path/to/plugin1" }
      );
    });
  });
});
