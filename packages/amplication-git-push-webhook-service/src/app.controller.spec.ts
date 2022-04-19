import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { QueueService } from './queue.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [QueueService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
});
