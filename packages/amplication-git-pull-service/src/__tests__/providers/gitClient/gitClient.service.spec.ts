import { GitClientService } from "../../../providers/gitClient/gitClient.service";
import { mockGitClientService } from "../../../__mocks__/providers/gitClient/gitClientService";
import { Test, TestingModule } from "@nestjs/testing";
import { cloneStub, pullStub } from "../../../__mocks__/stubs/gitClient.stub";

describe("Testing GitClientService", () => {
  let gitClientService: GitClientService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GitClientService,
          useClass: mockGitClientService,
        },
      ],
    }).compile();

    gitClientService = module.get<GitClientService>(GitClientService);
  });

  it("should be defined", () => {
    expect(gitClientService).toBeDefined();
  });

  it.skip("should clone a repository to a specific dir", async () => {
    const result = await gitClientService.clone(
      cloneStub.pushEventMessage,
      cloneStub.baseDir,
      cloneStub.accessToken
    );
    expect(result).toEqual(undefined);
  });

  it.skip("should pull a repository to a specific dir", async () => {
    const result = await gitClientService.pull(
      pullStub.branch,
      pullStub.commit,
      pullStub.baseDir
    );
    expect(result).toEqual(undefined);
  });
});
