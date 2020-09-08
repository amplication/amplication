import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService]
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  //it('should throw an error', async () => {});
});
