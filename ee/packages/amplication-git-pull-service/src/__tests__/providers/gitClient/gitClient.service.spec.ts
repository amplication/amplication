import { ConfigModule } from '@nestjs/config';
import { GitClientService } from '../../../providers/gitClient/gitClient.service';
import { Test, TestingModule } from '@nestjs/testing';
import { cloneStub, pullStub } from '../../../__mocks__/stubs/gitClient.stub';

describe('Testing GitClientService', () => {
  let gitClientService: GitClientService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({})],
      providers: [GitClientService],
    }).compile();

    gitClientService = module.get<GitClientService>(GitClientService);
  });

  it('should be defined', () => {
    expect(gitClientService).toBeDefined();
  });

  it.skip('should clone a repository to a specific dir', async () => {
    jest.mock('simple-git', () => {
      return {
        clone: jest.fn(() => Promise.resolve()),
      };
    });
    const result = await gitClientService.clone(
      cloneStub.pushEventMessage,
      cloneStub.baseDir,
      cloneStub.accessToken
    );
    expect(result).toEqual(undefined);
  });

  it.skip('should pull a repository to a specific dir', async () => {
    const result = await gitClientService.pull(
      pullStub.pushEventMessage,
      pullStub.baseDir,
      pullStub.accessToken
    );
    expect(result).toEqual(undefined);
  });
});
