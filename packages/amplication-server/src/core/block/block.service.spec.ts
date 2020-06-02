import { Test, TestingModule } from '@nestjs/testing';
import { BlockService } from './block.service';
import { PrismaService } from 'src/services/prisma.service';

describe('BlockService', () => {
  let service: BlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({}))
        },
        BlockService
      ],
      imports: []
    }).compile();

    service = module.get<BlockService>(BlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
