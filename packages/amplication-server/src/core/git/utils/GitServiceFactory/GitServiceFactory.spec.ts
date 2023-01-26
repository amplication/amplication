import { GithubService } from "@amplication/git-utils";
import { GitFactory } from "@amplication/git-utils";
import { ConfigService } from "@nestjs/config";
import { mock } from "jest-mock-extended";
import { EnumGitProvider } from "../../dto/enums/EnumGitProvider";

describe("GitServiceFactory", () => {
  const github = mock<GithubService>();
  const configService = mock<ConfigService>();
  const gitServiceFactory = new GitFactory(configService);
  describe("GitServiceFactory.getService()", () => {
    it("should return an github service", () => {
      expect(
        gitServiceFactory.getProvider({ provider: EnumGitProvider.Github })
      ).toBe(github);
    });
    it("should throw error if source control dont exist", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(() => gitServiceFactory.getService("GitNone")).toThrow(Error);
    });
  });
});
