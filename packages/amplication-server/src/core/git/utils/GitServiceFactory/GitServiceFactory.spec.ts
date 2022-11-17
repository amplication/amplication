import { GithubService } from "@amplication/git-utils";
import { GitServiceFactory } from "@amplication/git-utils";

import { mock } from "jest-mock-extended";
import { EnumGitProvider } from "../../dto/enums/EnumGitProvider";

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
