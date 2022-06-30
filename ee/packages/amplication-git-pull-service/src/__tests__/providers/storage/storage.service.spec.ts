import { StorageService } from '../../../providers/storage/storage.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Testing StorageService', () => {
  let storageService: StorageService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
    }).compile();

    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(storageService).toBeDefined();
  });
});
