import { Test, TestingModule } from "@nestjs/testing";
import { EnumGitOrganizationType, EnumGitProvider } from "../../src/types";
import { GitService } from "../../src/git/git.service";
import { GitFactory } from "../../src/git/git-factory";
import { MOCK_GIT_SERVICE_FACTORY } from "./mocks";
import {
  GIT_HUB_FILE,
  INSTALLATION_URL,
  PR_HTML_URL,
  TEST_GIT_REMOTE_ORGANIZATION,
  TEST_GIT_REPO,
  TEST_GIT_REPOS,
} from "./git.constants";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EnumPullRequestMode } from "../../src/types";

describe("GitService", () => {
  let gitService: GitService;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        GitService,
        {
          provide: GitFactory,
          useValue: MOCK_GIT_SERVICE_FACTORY,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (!key) {
                return null;
              }
              return key;
            }),
          },
        },
      ],
    }).compile();

    gitService = module.get<GitService>(GitService);
  });

  it("should be defined", () => {
    expect(gitService).toBeDefined();
  });
  {
    describe("GitService.createRepo()", () => {
      it("should return remote git repository", async () => {
        const repository = await gitService.createGitRepository(
          "repoName",
          EnumGitProvider.Github,
          EnumGitOrganizationType.Organization,
          "gitOrganizationName",
          "123456",
          true
        );
        expect(repository).toEqual(TEST_GIT_REPO);
      });
    });

    describe("GitService.getReposOfOrganization()", () => {
      it("should return RemoteGitRepositories[]", async () => {
        const installationId = "123456";
        const gitProvider = EnumGitProvider.Github;
        const remoteGitRepositories = await gitService.getReposOfOrganization(
          gitProvider,
          installationId,
          2,
          1
        );
        expect(remoteGitRepositories).toEqual(TEST_GIT_REPOS);
      });
    });

    describe("GitService.RemoteGitOrganization()", () => {
      it("should return RemoteGitOrganization", async () => {
        const installationId = "123456";
        const gitProvider = EnumGitProvider.Github;
        const remoteGitOrganization = await gitService.getGitRemoteOrganization(
          installationId,
          gitProvider
        );
        expect(remoteGitOrganization).toEqual(TEST_GIT_REMOTE_ORGANIZATION);
      });
    });

    describe("GitService.deleteGitOrganization()", () => {
      it("should return success", async () => {
        const installationId = "123456";
        const gitProvider = EnumGitProvider.Github;
        const remoteGitOrganization = await gitService.deleteGitOrganization(
          gitProvider,
          installationId
        );
        expect(remoteGitOrganization).toEqual(true);
      });
    });

    describe("GitService.getGitInstallationUrl()", () => {
      it("should return installationUrl (string)", async () => {
        const installationId = "123456";
        const gitProvider = EnumGitProvider.Github;
        const remoteGitOrganization = await gitService.getGitInstallationUrl(
          gitProvider,
          installationId
        );
        expect(remoteGitOrganization).toEqual(INSTALLATION_URL);
      });
    });

    describe("GitService.getFile()", () => {
      it("should return installationUrl (string)", async () => {
        const installationId = "123456";
        const gitProvider = EnumGitProvider.Github;
        const userName = "exampleUserName";
        const repoName = "exampleRepoName";
        const path = "examplePath";
        const baseBranchName = null;

        const gitHubFile = await gitService.getFile(
          gitProvider,
          userName,
          repoName,
          path,
          baseBranchName,
          installationId
        );
        expect(gitHubFile).toEqual(GIT_HUB_FILE);
      });
    });

    describe("GitService.createPullRequest()", () => {
      it("should return PR url path (string)", async () => {
        const installationId = "123456";
        const gitProvider = EnumGitProvider.Github;
        const userName = "exampleUserName";
        const repoName = "exampleRepoName";
        const path = "examplePath";
        const code = "exampleCode";
        const modules = [{ path: path, code: code }];
        const commitName = "exampleCommitName";
        const commitMessage = "exampleCommitMessage";
        const commitDescription = "exampleCommitDescription";
        const baseBranchName = "exampleBaseBranchName";
        const basePath = "packages";
        const head = "amplication";
        const remoteGitOrganization = await gitService.createPullRequest(
          EnumPullRequestMode.Basic,
          gitProvider,
          userName,
          repoName,
          modules,
          commitName,
          commitMessage,
          commitDescription,
          installationId,
          head,
          {
            adminUIPath: basePath + "admin-ui",
            serverPath: basePath + "server",
          }
          // baseBranchName
        );
        expect(remoteGitOrganization).toEqual(PR_HTML_URL);
      });
    });
  }
});
