import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';
import { BuildConsumer } from './build.consumer';
import { BuildRequest } from './dto/BuildRequest';

const EXAMPLE_BUILD_ID = 'exampleBuildId';

describe('BuildConsumer', () => {
  let consumer: BuildConsumer;

  jest.clearAllMocks();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuildConsumer]
    }).compile();

    consumer = module.get<BuildConsumer>(BuildConsumer);
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
