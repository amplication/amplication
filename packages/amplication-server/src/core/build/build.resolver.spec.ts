import { Test, TestingModule } from '@nestjs/testing';
import { BuildResolver } from './build.resolver';
import { BuildService } from './build.service';
import { ExceptionFiltersModule } from 'src/filters/exceptionFilters.module';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { CreateBuildArgs } from './dto/CreateBuildArgs';

const EXAMPLE_USER_ID = 'ExampleUserId';
const EXAMPLE_APP_ID = 'ExampleAppId';

const createMock = jest.fn(() => {
  return;
});

const canActivateMock = jest.fn(() => {
  return true;
});

describe('BuildResolver', () => {
  let resolver: BuildResolver;

  jest.clearAllMocks();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ExceptionFiltersModule],
      providers: [
        BuildResolver,
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

    resolver = module.get<BuildResolver>(BuildResolver);
  });

  test('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  test('create', async () => {
    const args: CreateBuildArgs = {
      data: {
        createdBy: {
          connect: {
            id: EXAMPLE_USER_ID
          }
        },
        app: {
          connect: {
            id: EXAMPLE_APP_ID
          }
        }
      }
    };
    expect(await resolver.create(args));
    expect(createMock).toBeCalledTimes(1);
    expect(createMock).toBeCalledWith(args);
  });
});
