import { GitHostProviderService } from '../../../providers/gitProvider/gitHostProvider.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MOCK_GITHUB_PROVIDER_SERVICE } from '../../../__mocks__/providers/gitProvider/gitHubProviderService';
import { MOCK_INSTALLATION_ID } from '../../../__mocks__/stubs/gitProvider.stub';
import { MOCK_ACCESS_TOKEN } from '../../../__mocks__/stubs/gitClient.stub';

describe('Testing GitProviderService', () => {
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

  it('should be defined', () => {
    expect(gitProviderService).toBeDefined();
  });

  it('should return access token', async () => {
    const token: any = await gitProviderService.createInstallationAccessToken(
      MOCK_INSTALLATION_ID
    );
    expect(token).toEqual(MOCK_ACCESS_TOKEN);
  });
});
