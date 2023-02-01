import { EnumGitProvider, Branch } from "../types";
import { GithubService } from "./github.service";

let githubService: GithubService;

describe("github service", () => {
  beforeEach(() => {
    process.env.GITHUB_APP_INSTALLATION_URL = "1";
    process.env.GITHUB_APP_APP_ID = "1";
    process.env.GITHUB_APP_PRIVATE_KEY = "1";

    githubService = new GithubService({
      provider: EnumGitProvider.Github,
      installationId: "123",
    });

    githubService.init();
  });

  test("is instantiable", () => {
    expect(
      new GithubService({
        provider: EnumGitProvider.Github,
        installationId: "123",
      })
    ).toBeInstanceOf(GithubService);
  });

  describe("when createBranchIfNotExists", () => {
    test("when there is not a new branch is created", async () => {
      // Arrange
      const expectedBranch: Branch = {
        name: "my-awesome-branch",
        sha: "asd123",
      };
      // Act
      const result = await githubService.createBranchIfNotExists({
        owner: "spaghetti",
        branchName: "my-awesome-branch",
        repositoryName: "cool-repo",
      });
      // Assert
      expect(expectedBranch).toStrictEqual(result);
    });

    test("when a branch already exists doesn't create it", async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
