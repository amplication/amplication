import { Test, TestingModule } from '@nestjs/testing';
import cuid from 'cuid';
import {
  EnvironmentService,
  DEFAULT_ENVIRONMENT_NAME
} from './environment.service';
import { PrismaService } from 'nestjs-prisma';
import { Environment } from './dto';

const EXAMPLE_ENVIRONMENT_ID = 'exampleEnvironmentId';
const EXAMPLE_ENVIRONMENT_NAME = 'exampleEnvironmentName';
const EXAMPLE_ENVIRONMENT_ADDRESS = 'exampleEnvironmentAddress';
const EXAMPLE_ENVIRONMENT_DESCRIPTION = 'exampleEnvironmentDescription';
const EXAMPLE_APP_ID = 'exampleAppId';
const SANDBOX_ENVIRONMENT = 'Sandbox environment';

const EXAMPLE_CUID = 'EXAMPLE_CUID';

const EXAMPLE_ENVIRONMENT: Environment = {
  id: EXAMPLE_ENVIRONMENT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_ENVIRONMENT_NAME,
  address: EXAMPLE_ENVIRONMENT_ADDRESS,
  appId: EXAMPLE_APP_ID
};

const prismaEnvironmentCreateMock = jest.fn(() => {
  return EXAMPLE_ENVIRONMENT;
});
const prismaEnvironmentFindOneMock = jest.fn(() => {
  return EXAMPLE_ENVIRONMENT;
});
const prismaEnvironmentFindManyMock = jest.fn(() => {
  return [EXAMPLE_ENVIRONMENT];
});
const prismaEnvironmentUpdateMock = jest.fn(() => {
  return EXAMPLE_ENVIRONMENT;
});

jest.mock('cuid');
// eslint-disable-next-line
// @ts-ignore
cuid.mockImplementation(() => EXAMPLE_CUID);

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvironmentService,
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            environment: {
              create: prismaEnvironmentCreateMock,
              findUnique: prismaEnvironmentFindOneMock,
              update: prismaEnvironmentUpdateMock,
              findMany: prismaEnvironmentFindManyMock
            }
          }))
        }
      ]
    }).compile();

    service = module.get<EnvironmentService>(EnvironmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an environment', async () => {
    const args = {
      data: {
        name: EXAMPLE_ENVIRONMENT_NAME,
        description: EXAMPLE_ENVIRONMENT_DESCRIPTION,
        address: EXAMPLE_ENVIRONMENT_ADDRESS,
        app: { connect: { id: EXAMPLE_APP_ID } }
      }
    };
    expect(await service.createEnvironment(args)).toEqual(EXAMPLE_ENVIRONMENT);
    expect(prismaEnvironmentCreateMock).toBeCalledTimes(1);
    expect(prismaEnvironmentCreateMock).toBeCalledWith(args);
  });

  it('should create default environment', async () => {
    const args = {
      data: {
        name: DEFAULT_ENVIRONMENT_NAME,
        address: EXAMPLE_CUID,
        app: { connect: { id: EXAMPLE_APP_ID } }
      }
    };
    expect(await service.createDefaultEnvironment(EXAMPLE_APP_ID)).toEqual(
      EXAMPLE_ENVIRONMENT
    );
    expect(prismaEnvironmentCreateMock).toBeCalledTimes(1);
    expect(prismaEnvironmentCreateMock).toBeCalledWith(args);
  });

  it('should find one environment', async () => {
    const args = { where: { id: EXAMPLE_ENVIRONMENT_ID } };
    expect(await service.findOne(args)).toEqual(EXAMPLE_ENVIRONMENT);
    expect(prismaEnvironmentFindOneMock).toBeCalledTimes(1);
    expect(prismaEnvironmentFindOneMock).toBeCalledWith(args);
  });

  it('should find many environment', async () => {
    const args = { where: { app: { id: EXAMPLE_ENVIRONMENT_ID } } };
    expect(await service.findMany(args)).toEqual([EXAMPLE_ENVIRONMENT]);
    expect(prismaEnvironmentFindManyMock).toBeCalledTimes(1);
    expect(prismaEnvironmentFindManyMock).toBeCalledWith(args);
  });

  it('should get a default environment', async () => {
    expect(await service.getDefaultEnvironment(EXAMPLE_APP_ID)).toEqual(
      EXAMPLE_ENVIRONMENT
    );
    expect(prismaEnvironmentFindManyMock).toBeCalledTimes(1);
    expect(prismaEnvironmentFindManyMock).toBeCalledWith({
      take: 1,
      where: {
        app: {
          id: EXAMPLE_APP_ID
        },
        name: { equals: SANDBOX_ENVIRONMENT }
      }
    });
  });
});
