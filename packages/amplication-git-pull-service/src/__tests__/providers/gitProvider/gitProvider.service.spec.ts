import { GitHostProviderService } from "../../../providers/gitProvider/gitHostProvider.service";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { MOCK_GITHUB_PROVIDER_SERVICE } from "../../../__mocks__/providers/gitProvider/gitHubProviderService";

describe("Testing GitProviderService", () => {
  let gitProviderService: GitHostProviderService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({})],
      providers: [
        {
          provide: GitHostProviderService,
          useValue: MOCK_GITHUB_PROVIDER_SERVICE,
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
