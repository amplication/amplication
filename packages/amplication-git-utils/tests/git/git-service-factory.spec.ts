import { EnumGitProvider } from "../../src/types";
import { GithubService } from "../../src/git/github.service";
import { GitServiceFactory } from "../../src/git/git-service-factory";
import { mock } from "jest-mock-extended";

describe("GitServiceFactory", () => {
  const github = mock<GithubService>();
  const gitServiceFactory = new GitServiceFactory(github);
  describe("GitServiceFactory.getService()", () => {
    it("should return an github service", () => {
      expect(gitServiceFactory.getService(EnumGitProvider.Github)).toBe(github);
    });
    it("should throw error if source control dont exist", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(() => gitServiceFactory.getService("GitNone")).toThrow(Error);
    });
  });
});
