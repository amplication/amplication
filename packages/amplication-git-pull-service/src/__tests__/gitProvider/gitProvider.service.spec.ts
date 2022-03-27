import { ConfigModule } from "@nestjs/config";
import { GitProviderService } from "../../providers/git/gitProvider.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("Testing GitProviderService", () => {
  let gitProviderService: GitProviderService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [".env"],
        }),
      ],
      providers: [GitProviderService],
    }).compile();

    gitProviderService = module.get<GitProviderService>(GitProviderService);
  });

  it("should be defined", () => {
    expect(gitProviderService).toBeDefined();
  });

  it("should return access token", async () => {
    const token = await gitProviderService.createInstallationAccessToken(
      "24226448"
    );
    expect(token).not.toBe(null);
  });
});
