import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';
import { EnumDataType } from '@prisma/client';
import { StorageService } from '@codebrew/nestjs-storage';
import { Entity } from 'src/models';
import { PrismaService } from 'nestjs-prisma';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as DataServiceGenerator from 'amplication-data-service-generator';
import { EntityService } from '..';
import { BuildConsumer } from './build.consumer';
import { BuildRequest } from './dto/BuildRequest';
import { createZipFileFromModules } from './zip';
import { getBuildFilePath } from './storage';
import { AppRoleService } from '../appRole/appRole.service';
import { Action } from './../action/dto/Action';
import { EnumActionStepStatus } from './../action/dto/EnumActionStepStatus';

const EXAMPLE_BUILD_ID = 'exampleBuildId';
const EXAMPLE_ENTITY_VERSION_ID = 'exampleEntityVersionId';
const EXAMPLE_BUILD = {
  id: EXAMPLE_BUILD_ID,
  entityVersions: [
    {
      id: EXAMPLE_ENTITY_VERSION_ID
    }
  ]
};
const EXAMPLE_ENTITY: Entity = {
  id: 'ExampleEntityId',
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: 'exampleApp',
  name: 'exampleEntity',
  displayName: 'example entity',
  pluralDisplayName: 'exampleEntities',
  description: 'example entity',
  lockedByUserId: undefined,
  lockedAt: null,
  fields: [
    {
      id: 'ExampleEntityFieldId',
      fieldPermanentId: 'ExampleEntityFieldPermanentId',
      name: 'ExampleEntityField',
      createdAt: new Date(),
      updatedAt: new Date(),
      dataType: EnumDataType.Id,
      description: 'ExampleEntityFieldId',
      displayName: 'Example Entity Field',
      properties: {},
      required: true,
      searchable: false
    }
  ]
};

const EXAMPLE_ACTION_WITH_STEP: Action = {
  id: 'ExampleActionId',
  createdAt: new Date(),
  steps: [
    {
      id: 'ExampleActionStepId',
      createdAt: new Date(),
      message: 'Example Step Message',
      status: EnumActionStepStatus.Running,
      completedAt: null
    }
  ]
};

const putMock = jest.fn(async () => {
  return;
});

const findOneMock = jest.fn(async () => {
  return EXAMPLE_BUILD;
});

const updateMock = jest.fn(async () => {
  return;
});

const actionStepUpdateMock = jest.fn(async () => {
  return;
});
const actionUpdateMock = jest.fn(async () => {
  return EXAMPLE_ACTION_WITH_STEP;
});

const getEntitiesByVersionsMock = jest.fn(async () => {
  return [EXAMPLE_ENTITY];
});

const getAppRolesMock = jest.fn(() => []);

const EXAMPLE_MODULES: DataServiceGenerator.Module[] = [
  {
    path: 'examplePath',
    code: 'exampleCode'
  }
];

const infoMock = jest.fn();
const childMock = jest.fn(() => ({ info: infoMock }));

const EXAMPLE_JOB = {
  data: {
    id: EXAMPLE_BUILD_ID
  }
} as Job<BuildRequest>;

const prismaMock = {
  build: {
    update: updateMock,
    findOne: findOneMock
  },
  action: {
    update: actionUpdateMock
  },
  actionStep: {
    update: actionStepUpdateMock
  }
};

jest.mock('amplication-data-service-generator');

describe('BuildConsumer', () => {
  let consumer: BuildConsumer;

  jest.clearAllMocks();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: StorageService,
          useValue: {
            registerDriver() {
              return;
            },
            getDisk() {
              return {
                put: putMock
              };
            }
          }
        },
        {
          provide: PrismaService,
          useValue: prismaMock
        },
        {
          provide: EntityService,
          useValue: {
            getEntitiesByVersions: getEntitiesByVersionsMock
          }
        },
        {
          provide: AppRoleService,
          useValue: {
            getAppRoles: getAppRolesMock
          }
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            child: childMock
          }
        },
        BuildConsumer
      ]
    }).compile();

    consumer = module.get<BuildConsumer>(BuildConsumer);
  });

  test('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  test('build', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    DataServiceGenerator.createDataService.mockResolvedValue(EXAMPLE_MODULES);
    expect(await consumer.build(EXAMPLE_JOB)).toBeUndefined();
    expect(putMock).toBeCalledTimes(1);
    expect(putMock).toBeCalledWith(
      getBuildFilePath(EXAMPLE_BUILD_ID),
      await createZipFileFromModules(EXAMPLE_MODULES)
    );
    expect(findOneMock).toBeCalledTimes(1);
    expect(findOneMock).toBeCalledWith({
      where: { id: EXAMPLE_BUILD_ID },
      include: {
        blockVersions: {
          select: {
            id: true
          }
        },
        entityVersions: {
          select: {
            id: true
          }
        }
      }
    });
    expect(getEntitiesByVersionsMock).toBeCalledTimes(1);
    expect(getEntitiesByVersionsMock).toBeCalledWith({
      where: { id: { in: [EXAMPLE_ENTITY_VERSION_ID] } },
      include: {
        fields: true,
        permissions: {
          include: {
            permissionFields: {
              include: {
                field: true,
                permissionFieldRoles: {
                  include: {
                    appRole: true
                  }
                }
              }
            },
            permissionRoles: {
              include: {
                appRole: true
              }
            }
          }
        }
      }
    });
    expect(childMock).toBeCalledTimes(1);
    expect(childMock).toBeCalledWith({
      buildId: EXAMPLE_BUILD_ID
    });
  });
});
