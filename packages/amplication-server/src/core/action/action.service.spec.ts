import { Test, TestingModule } from "@nestjs/testing";
import { ACTION_LOG_LEVEL, ActionService, SELECT_ID } from "./action.service";
import { PrismaService } from "../../prisma/prisma.service";
import { Action } from "./dto/Action";
import { ActionStep } from "./dto/ActionStep";
import { EnumActionStepStatus } from "./dto/EnumActionStepStatus";
import { FindOneActionArgs } from "./dto/FindOneActionArgs";
import { EnumActionLogLevel } from "./dto";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { UserActionLog } from "@amplication/schema-registry";

const EXAMPLE_ACTION_ID = "exampleActionId";
const EXAMPLE_ACTION_STEP_ID = "exampleActionStepId";
const EXAMPLE_ACTION: Action = {
  id: EXAMPLE_ACTION_ID,
  createdAt: new Date(),
};

const EXAMPLE_ACTION_STEP: ActionStep = {
  id: EXAMPLE_ACTION_STEP_ID,
  createdAt: new Date(),
  name: "ExampleActionStepName",
  message: "ExampleActionMessage",
  status: EnumActionStepStatus.Running,
  completedAt: null,
  logs: null,
};
const EXAMPLE_MESSAGE = "Example message";
const EXAMPLE_STEP_NAME = "ExampleStepName";
const EXAMPLE_STATUS = EnumActionStepStatus.Success;
const EXAMPLE_LEVEL = EnumActionLogLevel.Info;
const EXAMPLE_ERROR = new Error("EXAMPLE_ERROR_MESSAGE");

const prismaActionFindOneMock = jest.fn(() => EXAMPLE_ACTION);
const prismaActionStepFindManyMock = jest.fn(() => [EXAMPLE_ACTION_STEP]);
const prismaActionStepCreateMock = jest.fn(() => EXAMPLE_ACTION_STEP);
const prismaActionStepUpdateMock = jest.fn();
const prismaActionLogCreateMock = jest.fn();

describe("ActionService", () => {
  let service: ActionService;

  const mockServiceEmitMessage = jest
    .fn()
    .mockImplementation((topic: string, message: UserActionLog.KafkaEvent) =>
      Promise.resolve()
    );

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionService,
        {
          provide: PrismaService,
          useValue: {
            action: {
              findUnique: prismaActionFindOneMock,
            },
            actionStep: {
              findMany: prismaActionStepFindManyMock,
              create: prismaActionStepCreateMock,
              update: prismaActionStepUpdateMock,
            },
            actionLog: {
              create: prismaActionLogCreateMock,
            },
          },
        },
        {
          provide: KafkaProducerService,
          useClass: jest.fn(() => ({
            emitMessage: mockServiceEmitMessage,
          })),
        },
        {
          provide: AmplicationLogger,
          useClass: jest.fn(() => ({
            error: jest.fn(),
          })),
        },
      ],
    }).compile();

    service = module.get<ActionService>(ActionService);
  });

  test("should be defined", () => {
    expect(service).toBeDefined();
  });

  test("finds one action", async () => {
    const args: FindOneActionArgs = {
      where: {
        id: EXAMPLE_ACTION_ID,
      },
    };
    expect(await service.findOne(args)).toEqual(EXAMPLE_ACTION);
  });

  test("gets action steps", async () => {
    expect(await service.getSteps(EXAMPLE_ACTION_ID)).toEqual([
      EXAMPLE_ACTION_STEP,
    ]);
  });

  test("creates action step", async () => {
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
          connect: { id: EXAMPLE_ACTION_ID },
        },
      },
    });
  });

  test("updates action step status and sets completion time", async () => {
    expect(
      await service.complete(EXAMPLE_ACTION_STEP, EXAMPLE_STATUS)
    ).toBeUndefined();
    expect(prismaActionStepUpdateMock).toBeCalledTimes(1);
    expect(prismaActionStepUpdateMock).toBeCalledWith({
      where: {
        id: EXAMPLE_ACTION_STEP_ID,
      },
      data: {
        status: EXAMPLE_STATUS,
        completedAt: expect.any(Date),
      },
      select: SELECT_ID,
    });
  });

  test("logs into action step", async () => {
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
          connect: { id: EXAMPLE_ACTION_STEP_ID },
        },
      },
      select: SELECT_ID,
    });
  });

  test("creates step, runs action function, updates status successful and returns value", async () => {
    const exampleValue = "EXAMPLE_VALUE";
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
          connect: { id: EXAMPLE_ACTION_ID },
        },
      },
    });
    expect(prismaActionStepUpdateMock).toBeCalledWith({
      where: {
        id: EXAMPLE_ACTION_STEP_ID,
      },
      data: {
        status: EXAMPLE_STATUS,
        completedAt: expect.any(Date),
      },
      select: SELECT_ID,
    });
  });

  test("creates step, runs action function, updates status failed, and throws error", async () => {
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
          connect: { id: EXAMPLE_ACTION_ID },
        },
      },
    });
    expect(prismaActionLogCreateMock).toBeCalledTimes(1);
    expect(prismaActionLogCreateMock).toBeCalledWith({
      data: {
        level: EnumActionLogLevel.Error,
        message: EXAMPLE_ERROR.message,
        meta: {},
        step: {
          connect: { id: EXAMPLE_ACTION_STEP_ID },
        },
      },
      select: SELECT_ID,
    });
    expect(prismaActionStepUpdateMock).toBeCalledTimes(1);
    expect(prismaActionStepUpdateMock).toBeCalledWith({
      where: {
        id: EXAMPLE_ACTION_STEP_ID,
      },
      data: {
        status: EnumActionStepStatus.Failed,
        completedAt: expect.any(Date),
      },
      select: SELECT_ID,
    });
  });

  test("logs info into action step", async () => {
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
          connect: { id: EXAMPLE_ACTION_STEP_ID },
        },
      },
      select: SELECT_ID,
    });
  });

  describe("onUserActionLog", () => {
    it("should log the action and update action step status if completed", async () => {
      const logByStepIdSpy = jest
        .spyOn(service, "logByStepId")
        .mockImplementation();
      const updateActionStepStatusSpy = jest
        .spyOn(service, "updateActionStepStatus")
        .mockImplementation();

      const mockLogEntry: UserActionLog.Value = {
        stepId: "test-step",
        message: "Test message",
        level: "Info",
        status: EnumActionStepStatus.Success,
        isCompleted: true,
      };

      await service.onUserActionLog(mockLogEntry);

      expect(logByStepIdSpy).toHaveBeenCalledWith(
        mockLogEntry.stepId,
        ACTION_LOG_LEVEL[mockLogEntry.level.toLowerCase()],
        mockLogEntry.message
      );

      expect(updateActionStepStatusSpy).toHaveBeenCalledWith(
        mockLogEntry.stepId,
        mockLogEntry.status
      );

      // restore mocks (spyOn) to avoid test pollution
      logByStepIdSpy.mockRestore();
      updateActionStepStatusSpy.mockRestore();
    });

    it("should log the action and not update action step status if not completed", async () => {
      const logByStepIdSpy = jest
        .spyOn(service, "logByStepId")
        .mockImplementation();
      const updateActionStepStatusSpy = jest
        .spyOn(service, "updateActionStepStatus")
        .mockImplementation();

      const mockLogEntry: UserActionLog.Value = {
        stepId: "test-step",
        message: "Test message",
        level: "Info",
        status: EnumActionStepStatus.Running,
        isCompleted: false,
      };

      await service.onUserActionLog(mockLogEntry);

      expect(logByStepIdSpy).toHaveBeenCalledWith(
        mockLogEntry.stepId,
        ACTION_LOG_LEVEL[mockLogEntry.level.toLowerCase()],
        mockLogEntry.message
      );

      expect(updateActionStepStatusSpy).not.toHaveBeenCalled();

      // restore mocks (spyOn) to avoid test pollution
      logByStepIdSpy.mockRestore();
      updateActionStepStatusSpy.mockRestore();
    });

    it("should log to the database before updating the action step status", async () => {
      const logEntry: UserActionLog.Value = {
        stepId: "test-step-id",
        message: "test-message",
        level: "Info",
        status: EnumActionStepStatus.Success,
        isCompleted: true,
      };

      const logByStepIdSpy = jest
        .spyOn(service, "logByStepId")
        .mockImplementation(() => Promise.resolve());

      const updateActionStepStatusSpy = jest
        .spyOn(service, "updateActionStepStatus")
        .mockImplementation(() => Promise.resolve());

      await service.onUserActionLog(logEntry);

      // get call order and ensure both functions are called in the same order of their invocation
      const logByStepIdCallOrder = logByStepIdSpy.mock.invocationCallOrder[0];
      const updateActionStepStatusCallOrder =
        updateActionStepStatusSpy.mock.invocationCallOrder[0];

      // compare call order
      expect(logByStepIdCallOrder).toBeLessThan(
        updateActionStepStatusCallOrder
      );

      // restore mocks (spyOn) to avoid test pollution
      logByStepIdSpy.mockRestore();
      updateActionStepStatusSpy.mockRestore();
    });
  });

  describe("Action Context functions", () => {
    let step: ActionStep;
    let userActionId: string;
    let topicName: string;
    let actionContext;

    beforeEach(() => {
      jest.clearAllMocks();

      step = {
        id: "1",
        name: "some-step-name",
        message: "some-message",
        status: EnumActionStepStatus.Success,
        createdAt: new Date(),
      };
      userActionId = "user-action-id";
      topicName = "topic-name"; // Replace with the actual topic name you're working with
      actionContext = service.createActionContext(
        userActionId,
        step,
        topicName
      );
    });

    it("onEmitUserActionLog should call emitUserActionLog", async () => {
      const message = "Test message";
      const level = EnumActionLogLevel.Info;
      const status = EnumActionStepStatus.Running;
      const isStepCompleted = false;

      const expectedKafkaMessage: UserActionLog.KafkaEvent =
        service.createKafkaMessageForUserActionLog(userActionId, step.id)(
          message,
          level,
          status,
          isStepCompleted
        );

      await actionContext.onEmitUserActionLog(
        message,
        level,
        status,
        isStepCompleted
      );

      expect(mockServiceEmitMessage).toHaveBeenCalledWith(
        topicName,
        expectedKafkaMessage
      );
    });

    it("createKafkaMessageForUserActionLog should return a Kafka message", () => {
      const userActionId = "user-action-id";
      const stepId = "step-id";
      const message = "test message";
      const level = EnumActionLogLevel.Info;
      const status = EnumActionStepStatus.Running;
      const isStepCompleted = false;

      const kafkaMessage: UserActionLog.KafkaEvent = {
        key: {
          userActionId,
        },
        value: {
          stepId,
          message,
          level,
          status,
          isCompleted: isStepCompleted,
        },
      };

      const result = service.createKafkaMessageForUserActionLog(
        userActionId,
        stepId
      )(message, level, status, isStepCompleted);

      expect(result).toEqual(kafkaMessage);
    });
  });
});
