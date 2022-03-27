import { GitClientService } from "../../../providers/gitClient/gitClient.service";
import { pullDataMock, pullEventMock } from "../../../__mocks__/mockData";
import { Test, TestingModule } from "@nestjs/testing";
import { MOCK_GIT_CLIENT_SERVICE } from "../../../__mocks__/providers/gitClient/gitClientService";

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
      pullEventMock,
      pullDataMock.baseDir,
      "123456",
      "acceestoken123"
    );
    expect(result).toEqual({});
  });

  it("should pull a repository to a specific dir", async () => {
    const result = await gitClientService.pull(pullDataMock);
    expect(result).toEqual({});
  });
});
