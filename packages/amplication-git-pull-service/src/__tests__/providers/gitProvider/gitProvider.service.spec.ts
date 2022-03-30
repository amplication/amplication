import { GitProviderService } from "../../../providers/gitProvider/gitProvider.service";
import { MOCK_GIT_PROVIDER_SERVICE } from "../../../__mocks__/providers/gitProvider/gitProviderService";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

describe("Testing GitProviderService", () => {
  let gitProviderService: GitProviderService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({})],
      providers: [
        {
          provide: GitProviderService,
          useValue: MOCK_GIT_PROVIDER_SERVICE,
        },
      ],
    }).compile();

    gitProviderService = module.get<GitProviderService>(GitProviderService);
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
