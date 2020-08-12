import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedAppResolver } from './build.resolver';
import { BuildService } from './build.service';
import { ExceptionFiltersModule } from 'src/filters/exceptionFilters.module';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';

const createMock = jest.fn(() => {
  return;
});

const canActivateMock = jest.fn(() => {
  return true;
});

describe('GeneratedAppResolver', () => {
  let resolver: GeneratedAppResolver;

  jest.clearAllMocks();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ExceptionFiltersModule],
      providers: [
        GeneratedAppResolver,
        {
          provide: BuildService,
          useValue: {
            create: createMock
          }
        }
      ]
    })
      .overrideGuard(GqlAuthGuard)
      .useValue({ canActivate: canActivateMock })
      .compile();

    resolver = module.get<GeneratedAppResolver>(GeneratedAppResolver);
  });

  test('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  test('create', async () => {
    const args = { data: {} };
    expect(await resolver.create(args));
    expect(createMock).toBeCalledTimes(1);
    expect(createMock).toBeCalledWith(args);
  });
});
