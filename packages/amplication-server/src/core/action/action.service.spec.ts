import { Test, TestingModule } from '@nestjs/testing';
import { ActionService, SELECT_ID } from './action.service';
import { PrismaService } from 'nestjs-prisma';
import { Action } from './dto/Action';
import { ActionStep } from './dto/ActionStep';
import { EnumActionStepStatus } from './dto/EnumActionStepStatus';
import { FindOneActionArgs } from './dto/FindOneActionArgs';
import { EnumActionLogLevel } from './dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

const EXAMPLE_ACTION_ID = 'exampleActionId';
const EXAMPLE_ACTION_STEP_ID = 'exampleActionStepId';
const EXAMPLE_ACTION: Action = {
  id: EXAMPLE_ACTION_ID,
  createdAt: new Date()
};

const EXAMPLE_ACTION_STEP: ActionStep = {
  id: EXAMPLE_ACTION_STEP_ID,
  createdAt: new Date(),
  name: 'ExampleActionStepName',
  message: 'ExampleActionMessage',
  status: EnumActionStepStatus.Running,
  completedAt: null,
  logs: null
};
const EXAMPLE_MESSAGE = 'Example message';
const EXAMPLE_STEP_NAME = 'ExampleStepName';
const EXAMPLE_STATUS = EnumActionStepStatus.Success;
const EXAMPLE_LEVEL = EnumActionLogLevel.Info;
const EXAMPLE_ERROR = new Error('EXAMPLE_ERROR_MESSAGE');

const prismaActionFindOneMock = jest.fn(() => EXAMPLE_ACTION);
const prismaActionStepFindManyMock = jest.fn(() => [EXAMPLE_ACTION_STEP]);
const prismaActionStepCreateMock = jest.fn(() => EXAMPLE_ACTION_STEP);
const prismaActionStepUpdateMock = jest.fn();
const prismaActionLogCreateMock = jest.fn();

describe('ActionService', () => {
  let service: ActionService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionService,
        {
          provide: PrismaService,
          useValue: {
            action: {
              findUnique: prismaActionFindOneMock
            },
            actionStep: {
              findMany: prismaActionStepFindManyMock,
              create: prismaActionStepCreateMock,
              update: prismaActionStepUpdateMock
            },
            actionLog: {
              create: prismaActionLogCreateMock
            }
          }
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useClass: jest.fn(() => ({
            error: jest.fn()
          }))
        }
      ]
    }).compile();

    service = module.get<ActionService>(ActionService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('finds one action', async () => {
    const args: FindOneActionArgs = {
      where: {
        id: EXAMPLE_ACTION_ID
      }
    };
    expect(await service.findOne(args)).toEqual(EXAMPLE_ACTION);
  });

  test('gets action steps', async () => {
    expect(await service.getSteps(EXAMPLE_ACTION_ID)).toEqual([
      EXAMPLE_ACTION_STEP
    ]);
  });

  test('creates action step', async () => {
    expect(
      await service.createStep(
        EXAMPLE_ACTION_ID,
        EXAMPLE_STEP_NAME,
        EXAMPLE_MESSAGE
      )
    ).toEqual(EXAMPLE_ACTION_STEP);
    expect(prismaActionStepCreateMock).toBeCalledTimes(1);
    expect(prismaActionStepCreateMock).toBeCalledWith({
      data: {
        status: EnumActionStepStatus.Running,
        name: EXAMPLE_STEP_NAME,
        message: EXAMPLE_MESSAGE,
        action: {
          connect: { id: EXAMPLE_ACTION_ID }
        }
      }
    });
  });

  test('updates action step status and sets completion time', async () => {
    expect(
      await service.complete(EXAMPLE_ACTION_STEP, EXAMPLE_STATUS)
    ).toBeUndefined();
    expect(prismaActionStepUpdateMock).toBeCalledTimes(1);
    expect(prismaActionStepUpdateMock).toBeCalledWith({
      where: {
        id: EXAMPLE_ACTION_STEP_ID
      },
      data: {
        status: EXAMPLE_STATUS,
        completedAt: expect.any(Date)
      },
      select: SELECT_ID
    });
  });

  test('logs into action step', async () => {
    expect(
      await service.log(EXAMPLE_ACTION_STEP, EXAMPLE_LEVEL, EXAMPLE_MESSAGE)
    ).toBeUndefined();
    expect(prismaActionLogCreateMock).toBeCalledTimes(1);
    expect(prismaActionLogCreateMock).toBeCalledWith({
      data: {
        level: EXAMPLE_LEVEL,
        message: EXAMPLE_MESSAGE,
        meta: {},
        step: {
          connect: { id: EXAMPLE_ACTION_STEP_ID }
        }
      },
      select: SELECT_ID
    });
  });

  test('creates step, runs action function, updates status successful and returns value', async () => {
    const exampleValue = 'EXAMPLE_VALUE';
    const stepFunction = jest.fn(async () => exampleValue);
    await expect(
      service.run(
        EXAMPLE_ACTION_ID,
        EXAMPLE_STEP_NAME,
        EXAMPLE_MESSAGE,
        stepFunction
      )
    ).resolves.toBe(exampleValue);
    expect(prismaActionStepCreateMock).toBeCalledTimes(1);
    expect(prismaActionStepCreateMock).toBeCalledWith({
      data: {
        status: EnumActionStepStatus.Running,
        name: EXAMPLE_STEP_NAME,
        message: EXAMPLE_MESSAGE,
        action: {
          connect: { id: EXAMPLE_ACTION_ID }
        }
      }
    });
    expect(prismaActionStepUpdateMock).toBeCalledWith({
      where: {
        id: EXAMPLE_ACTION_STEP_ID
      },
      data: {
        status: EXAMPLE_STATUS,
        completedAt: expect.any(Date)
      },
      select: SELECT_ID
    });
  });

  test('creates step, runs action function, updates status failed, and throws error', async () => {
    const stepFunction = jest.fn(() => {
      throw EXAMPLE_ERROR;
    });
    await expect(
      service.run(
        EXAMPLE_ACTION_ID,
        EXAMPLE_STEP_NAME,
        EXAMPLE_MESSAGE,
        stepFunction
      )
    ).rejects.toBe(EXAMPLE_ERROR);
    expect(prismaActionStepCreateMock).toBeCalledTimes(1);
    expect(prismaActionStepCreateMock).toBeCalledWith({
      data: {
        status: EnumActionStepStatus.Running,
        name: EXAMPLE_STEP_NAME,
        message: EXAMPLE_MESSAGE,
        action: {
          connect: { id: EXAMPLE_ACTION_ID }
        }
      }
    });
    expect(prismaActionLogCreateMock).toBeCalledTimes(1);
    expect(prismaActionLogCreateMock).toBeCalledWith({
      data: {
        level: EnumActionLogLevel.Error,
        message: EXAMPLE_ERROR.toString(),
        meta: {},
        step: {
          connect: { id: EXAMPLE_ACTION_STEP_ID }
        }
      },
      select: SELECT_ID
    });
    expect(prismaActionStepUpdateMock).toBeCalledTimes(1);
    expect(prismaActionStepUpdateMock).toBeCalledWith({
      where: {
        id: EXAMPLE_ACTION_STEP_ID
      },
      data: {
        status: EnumActionStepStatus.Failed,
        completedAt: expect.any(Date)
      },
      select: SELECT_ID
    });
  });

  test('logs info into action step', async () => {
    expect(
      await service.logInfo(EXAMPLE_ACTION_STEP, EXAMPLE_MESSAGE)
    ).toBeUndefined();
    expect(prismaActionLogCreateMock).toBeCalledTimes(1);
    expect(prismaActionLogCreateMock).toBeCalledWith({
      data: {
        level: EnumActionLogLevel.Info,
        message: EXAMPLE_MESSAGE,
        meta: {},
        step: {
          connect: { id: EXAMPLE_ACTION_STEP_ID }
        }
      },
      select: SELECT_ID
    });
  });
});
