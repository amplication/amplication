import { GitClientService } from "../../../providers/gitClient/gitClient.service";
import { MOCK_GIT_CLIENT_SERVICE } from "../../../__mocks__/providers/gitClient/gitClientService";
import { Test, TestingModule } from "@nestjs/testing";
import * as os from "os";
import { GitProviderEnum } from "../../../contracts/enums/gitProvider.enum";
import { EnumGitPullEventStatus } from "../../../contracts/enums/gitPullEventStatus.enum";

describe("Testing GitClientService", () => {
  let gitClientService: GitClientService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GitClientService,
          useValue: MOCK_GIT_CLIENT_SERVICE,
        },
      ],
    }).compile();

    gitClientService = module.get<GitClientService>(GitClientService);
  });

  it("should be defined", () => {
    expect(gitClientService).toBeDefined();
  });

  it("should clone a repository to a specific dir", async () => {
    const result = await gitClientService.clone(
      {
        id: BigInt(1213),
        provider: GitProviderEnum.Github,
        repositoryOwner: "amit-amp",
        repositoryName: "test-repo",
        branch: "main",
        commit: "qwe234g",
        status: EnumGitPullEventStatus.Created,
        pushedAt: new Date(),
      },
      os.homedir() + "/Dev/gitPullTest/test-1",
      "123456",
      "112233445566"
    );
    expect(result).toEqual(undefined);
  });

  it("should pull a repository to a specific dir", async () => {
    const result = await gitClientService.pull(
      "origin",
      "main",
      "as122df",
      os.homedir() + "/Dev/gitPullTest/test-1"
    );
    expect(result).toEqual(undefined);
  });
});
