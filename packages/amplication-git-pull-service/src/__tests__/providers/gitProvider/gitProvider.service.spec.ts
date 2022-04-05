import { GitHostProviderService } from "../../../providers/gitProvider/gitHostProvider.service";
import { mockGitHostProviderService } from "../../../__mocks__/providers/gitProvider/gitProviderService";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

describe("Testing GitProviderService", () => {
  let gitProviderService: GitHostProviderService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({})],
      providers: [
        {
          provide: GitHostProviderService,
          useClass: mockGitHostProviderService,
        },
      ],
    }).compile();

    gitProviderService = module.get<GitHostProviderService>(
      GitHostProviderService
    );
  });

  it("should be defined", () => {
    expect(gitProviderService).toBeDefined();
  });

  it("should return access token", async () => {
    const token = await gitProviderService.createInstallationAccessToken(
      "12345678"
    );
    expect(token).not.toBe(null);
  });
});
