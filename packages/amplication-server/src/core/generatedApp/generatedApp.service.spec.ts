import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { GeneratedAppService } from './generatedApp.service';
import { QUEUE_NAME } from './constants';

const addMock = jest.fn(() => {
  return;
});

describe('GeneratedAppService', () => {
  let service: GeneratedAppService;

  jest.clearAllMocks();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneratedAppService,
        {
          provide: getQueueToken(QUEUE_NAME),
          useValue: {
            add: addMock
          }
        }
      ]
    }).compile();

    service = module.get<GeneratedAppService>(GeneratedAppService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('create', async () => {
    const args = {};
    expect(await service.create(args));
    expect(addMock).toBeCalledTimes(1);
    expect(addMock).toBeCalledWith(args);
  });
});
