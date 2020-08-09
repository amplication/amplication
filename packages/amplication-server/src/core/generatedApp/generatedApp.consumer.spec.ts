import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';
import { GeneratedAppConsumer } from './generatedApp.consumer';
import { AppGenerationRequest } from './dto/AppGenerationRequest';

describe('GeneratedAppConsumer', () => {
  let consumer: GeneratedAppConsumer;

  jest.clearAllMocks();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratedAppConsumer]
    }).compile();

    consumer = module.get<GeneratedAppConsumer>(GeneratedAppConsumer);
  });

  test('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  test('create', async () => {
    expect(
      await consumer.generate({
        data: {}
      } as Job<AppGenerationRequest>)
    );
  });
});
