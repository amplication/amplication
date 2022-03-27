import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { pullDataMock, pullEventMock } from "../../mocks/mockData";
import { Test, TestingModule } from "@nestjs/testing";

describe("Testing GitClientService", () => {
  let gitClientService: GitClientService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [GitClientService],
    }).compile();

    gitClientService = module.get<GitClientService>(GitClientService);
  });

  it("should be defined", () => {
    expect(gitClientService).toBeDefined();
  });

  it("should clone a repository to a specific dir", () => {
    const result = gitClientService.clone(
      pullEventMock,
      pullDataMock.baseDir,
      "123456",
      "acceestoken123"
    );
    expect(result).not.toBe(null);
  });

  it("should pull a repository to a specific dir", () => {
    const result = gitClientService.pull(pullDataMock);
    expect(result).not.toBe(null);
  });
});
