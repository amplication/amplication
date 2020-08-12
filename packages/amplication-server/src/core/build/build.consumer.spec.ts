import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';
import { GeneratedAppConsumer } from './build.consumer';
import { BuildRequest } from './dto/BuildRequest';

const EXAMPLE_BUILD_ID = 'exampleBuildId';

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
      await consumer.build({
        data: {
          id: EXAMPLE_BUILD_ID
        }
      } as Job<BuildRequest>)
    );
  });
});
