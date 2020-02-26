import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from '../services/app.service';
import { Chance } from 'chance';
const chance = new Chance();

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
  describe('hello/:name', () => {
    it('should return "Hello ${name}!"', () => {
      const name = chance.name();
      expect(appController.getHelloName(name)).toBe(`Hello ${name}!`);
    });
  });
});
