import { Test, TestingModule } from '@nestjs/testing';
import { BlockTypeService } from './blockType.service';
import { async } from 'rxjs/internal/scheduler/async';
import { BlockService } from './block.service';
import { EnumBlockType } from 'src/enums/EnumBlockType';

describe('BlockTypeService', () => {
  let service: BlockTypeService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockTypeService,
        {
          provide: BlockService,
          useClass: jest.fn(() => ({}))
        }
      ],
      imports: []
    }).compile();

    service = module.get<BlockTypeService>(BlockTypeService);
  });
  it;
});
