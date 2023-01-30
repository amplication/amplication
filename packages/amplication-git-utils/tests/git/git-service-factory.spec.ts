import { EnumGitProvider } from "../../src/types";
import { GithubService } from "../../src/git/github.service";
import { GitFactory } from "../../src/git/git-factory";
import { mock } from "jest-mock-extended";
import { ConfigService } from "@nestjs/config";

describe.skip("GitFactory", () => {
  const github = mock<GithubService>();
  const configService = mock<ConfigService>();
  const getGitProvider = new GitFactory(configService);
  describe("GitFactory.getProvider()", () => {
    it("should return an github service", () => {
      expect(
        getGitProvider.getProvider({ provider: EnumGitProvider.Github })
      ).toBe(github);
    });
    it("should throw error if source control dont exist", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(() => gitServiceFactory.getService("GitNone")).toThrow(Error);
    });
  });
});
