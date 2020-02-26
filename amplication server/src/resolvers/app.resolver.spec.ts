import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import { AppService } from '../services/app.service';
import { Chance } from 'chance';
const chance = new Chance();

describe('AppResolver', () => {
  let appResolver: AppResolver;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppResolver, AppService]
    }).compile();

    appResolver = app.get<AppResolver>(AppResolver);
  });

  describe('helloWorld', () => {
    it('should return "Hello World!"', () => {
      expect(appResolver.helloWorld()).toBe('Hello World!');
    });
  });
  describe('hello', () => {
    it('should return "Hello ${name}!"', () => {
      const name = chance.name();
      expect(appResolver.hello(name)).toBe(`Hello ${name}!`);
    });
  });
});
