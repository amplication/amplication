import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service';
import { PrismaService } from 'nestjs-prisma';
import { Action } from './dto/Action';
import { ActionStep } from './dto/ActionStep';
import { EnumActionStepStatus } from './dto/EnumActionStepStatus';
import { FindOneActionArgs } from './dto/FindOneActionArgs';

const EXAMPLE_ACTION_ID = 'exampleActionId';
const EXAMPLE_ACTION_STEP_ID = 'exampleActionStepId';
const EXAMPLE_ACTION: Action = {
  id: EXAMPLE_ACTION_ID,
  createdAt: new Date()
};

const EXAMPLE_ACTION_STEP: ActionStep = {
  id: EXAMPLE_ACTION_STEP_ID,
  createdAt: new Date(),
  message: 'ExampleActionMessage',
  status: EnumActionStepStatus.Running,
  completedAt: null,
  logs: null
};

const prismaActionFindOne = jest.fn(() => EXAMPLE_ACTION);
const prismaActionStepFindMany = jest.fn(() => [EXAMPLE_ACTION_STEP]);

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
              findOne: prismaActionFindOne
            },
            actionStep: {
              findMany: prismaActionStepFindMany
            }
          }
        }
      ]
    }).compile();

    service = module.get<ActionService>(ActionService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('find one action', async () => {
    const args: FindOneActionArgs = {
      where: {
        id: EXAMPLE_ACTION_ID
      }
    };
    expect(await service.findOne(args)).toEqual(EXAMPLE_ACTION);
  });

  test('find action steps', async () => {
    expect(await service.getSteps(EXAMPLE_ACTION_ID)).toEqual([
      EXAMPLE_ACTION_STEP
    ]);
  });
});
