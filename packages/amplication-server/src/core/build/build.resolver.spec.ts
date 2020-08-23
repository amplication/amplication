import { Test, TestingModule } from '@nestjs/testing';
import { BuildResolver } from './build.resolver';
import { BuildService } from './build.service';
import { ExceptionFiltersModule } from 'src/filters/exceptionFilters.module';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { CreateBuildArgs } from './dto/CreateBuildArgs';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';
import { FindManyBuildArgs } from './dto/FindManyBuildArgs';
import { BuildNotFoundError } from './errors/BuildNotFoundError';
import { AppService } from '../app/app.service';
import { UserService } from '../user/user.service';

const EXAMPLE_USER_ID = 'ExampleUserId';
const EXAMPLE_APP_ID = 'ExampleAppId';
const EXAMPLE_BUILD_ID = 'ExampleBuildId';
const EXAMPLE_BUILD = {
  id: EXAMPLE_BUILD_ID
};
const EXAMPLE_SIGNED_URL = 'http://example.com/app.zip';
const EXAMPLE_USER = {
  id: EXAMPLE_USER_ID
};
const EXAMPLE_APP = {
  id: EXAMPLE_APP_ID
};

const createMock = jest.fn(() => {
  return EXAMPLE_BUILD;
});

const createSignedURLMock = jest.fn(
  ({ where: { id } }: { where: { id: string } }) => {
    if (id === EXAMPLE_BUILD_ID) {
      return EXAMPLE_SIGNED_URL;
    }
    throw new BuildNotFoundError(id);
  }
);

const findManyMock = jest.fn(() => {
  return [EXAMPLE_BUILD];
});

const canActivateMock = jest.fn(() => {
  return true;
});

const userMock = jest.fn(() => EXAMPLE_USER);
const appMock = jest.fn(() => EXAMPLE_APP);

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
            create: createMock,
            createSignedURL: createSignedURLMock,
            findMany: findManyMock
          }
        },
        {
          provide: UserService,
          useValue: {
            user: userMock
          }
        },
        {
          provide: AppService,
          useValue: {
            app: appMock
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

  test('create build', async () => {
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
    expect(await resolver.createBuild(args)).toEqual(EXAMPLE_BUILD);
    expect(createMock).toBeCalledTimes(1);
    expect(createMock).toBeCalledWith(args);
  });

  test('create signed URL', async () => {
    const args: FindOneBuildArgs = {
      where: {
        id: EXAMPLE_BUILD_ID
      }
    };
    expect(await resolver.createBuildSignedURL(args)).toBe(EXAMPLE_SIGNED_URL);
  });

  test('fail to create signed URL for non existing build', async () => {
    const id = 'NonExistingBuildId';
    const args: FindOneBuildArgs = {
      where: {
        id
      }
    };
    expect(resolver.createBuildSignedURL(args)).rejects.toEqual(
      new BuildNotFoundError(id)
    );
  });

  test('find many builds', async () => {
    const args: FindManyBuildArgs = {
      where: {}
    };
    expect(await resolver.builds(args)).toEqual([EXAMPLE_BUILD]);
  });
});
