import { Inject, Injectable } from "@nestjs/common";
import { isEmpty } from "lodash";
import { JsonValue } from "type-fest";
import { PrismaService, Prisma } from "../../prisma";
import {
  Action,
  ActionStep,
  EnumActionLogLevel,
  FindOneActionArgs,
} from "./dto/";
import { StepNameEmptyError } from "./errors/StepNameEmptyError";
import { EnumActionStepStatus } from "./dto/EnumActionStepStatus";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { ActionContext, UserActionLogKafkaEvent } from "../userAction/types";
import { UserActionLog } from "@amplication/schema-registry";

export const SELECT_ID = { id: true };

export const ACTION_LOG_LEVEL: {
  [level: string]: EnumActionLogLevel;
} = {
  error: EnumActionLogLevel.Error,
  warning: EnumActionLogLevel.Warning,
  info: EnumActionLogLevel.Info,
  debug: EnumActionLogLevel.Debug,
};

@Injectable()
export class ActionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaProducerService: KafkaProducerService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  async findOne(args: FindOneActionArgs): Promise<Action | null> {
    return this.prisma.action.findUnique(args);
  }

  /**
   * Gets action steps for given action identifier
   * @param actionId action identifier to get steps for
   * @returns array of the steps of the action with ordered logs
   */
  async getSteps(actionId: string): Promise<ActionStep[]> {
    return this.prisma.actionStep.findMany({
      where: {
        actionId: actionId,
      },
      orderBy: {
        createdAt: Prisma.SortOrder.asc,
      },
      include: {
        logs: {
          orderBy: {
            createdAt: Prisma.SortOrder.asc,
          },
        },
      },
    });
  }

  /**
   * Creates a new step for given action with given message and sets its status
   * to running
   * @param actionId the identifier of the action to add step for
   * @param message the message of the step
   */
  async createStep(
    actionId: string,
    stepName: string,
    message: string
  ): Promise<ActionStep> {
    if (isEmpty(stepName)) {
      throw new StepNameEmptyError();
    }

    return this.prisma.actionStep.create({
      data: {
        status: EnumActionStepStatus.Running,
        message,
        name: stepName,
        action: {
          connect: { id: actionId },
        },
      },
    });
  }

  /**
   * Updates the status of given step with given status and sets it's completion time
   * @param step the step to update status and completion time for
   * @param status the status to update status with
   */
  async complete(
    step: ActionStep,
    status: EnumActionStepStatus.Success | EnumActionStepStatus.Failed
  ): Promise<void> {
    await this.prisma.actionStep.update({
      where: {
        id: step.id,
      },
      data: {
        status,
        completedAt: new Date(),
      },
      select: SELECT_ID,
    });
  }

  async updateActionStepStatus(
    actionStepId: string,
    status: EnumActionStepStatus
  ): Promise<void> {
    const step = await this.prisma.actionStep.findUnique({
      where: { id: actionStepId },
    });
    switch (status) {
      case EnumActionStepStatus.Success:
      case EnumActionStepStatus.Failed:
        await this.complete(step, status);
    }
  }

  /**
   * Logs given message with given level and given meta for given step
   * @param step the step to add log for
   * @param message the log message to add to step
   * @param meta metadata to add for the log
   */
  async log(
    step: ActionStep,
    level: EnumActionLogLevel,
    message: { toString(): string },
    meta: JsonValue = {}
  ): Promise<void> {
    await this.prisma.actionLog.create({
      data: {
        level,
        message: message.toString(),
        meta,
        step: {
          connect: { id: step.id },
        },
      },
      select: SELECT_ID,
    });
  }

  async onUserActionLog(logEntry: UserActionLog.Value): Promise<void> {
    const { stepId, message, level, status, isCompleted } = logEntry;

    await this.logByStepId(
      stepId,
      ACTION_LOG_LEVEL[level.toLowerCase()],
      message
    );

    if (isCompleted) {
      await this.updateActionStepStatus(stepId, status);
    }
  }

  async logByStepId(
    stepId: string,
    level: EnumActionLogLevel,
    message: string,
    meta: JsonValue = {}
  ): Promise<void> {
    await this.prisma.actionLog.create({
      data: {
        level,
        message,
        step: {
          connect: { id: stepId },
        },
        meta,
      },
      select: SELECT_ID,
    });
  }

  /**
   * Creates an ActionContext for emitLogByStepId and completeWithLog functions.
   * These functions are invoked as Promises and potential errors are immediately caught and logged.
   * The onEmitLogByStepId can be invoked synchronously.
   * This provides a means to fire-and-forget these actions without the need to await their completion.
   * The client of this ActionContext is expected to use 'void' operator while invoking these functions,
   * indicating we're not interested in their resolved value, thus handling uncaught Promise rejections.
   */
  createActionContext(
    userActionId: string,
    step: ActionStep,
    topicName: string
  ): ActionContext {
    const onEmitUserActionLog = async (
      message: string,
      level: EnumActionLogLevel,
      status: EnumActionStepStatus = EnumActionStepStatus.Running,
      isStepCompleted = false
    ) => {
      const onCreateKafkaMessageForUserActionLog =
        (userActionId: string, stepId: string) =>
        (
          message: string,
          level: EnumActionLogLevel,
          status: EnumActionStepStatus,
          isStepCompleted: boolean
        ) =>
          this.createKafkaMessageForUserActionLog(userActionId, stepId)(
            message,
            level,
            status,
            isStepCompleted
          );

      // partial application: the stepId is already known and the message and level are provided later
      const partialAppliedOnCreateKafkaMessageForUserActionLog =
        onCreateKafkaMessageForUserActionLog(userActionId, step.id);

      const kafkaMessage = partialAppliedOnCreateKafkaMessageForUserActionLog(
        message,
        level,
        status,
        isStepCompleted
      );

      return this.kafkaProducerService
        .emitMessage(topicName, kafkaMessage)
        .catch((error) =>
          this.logger.error(`Failed to log action step ${step.id}`, error, {
            stepId: step.id,
            topicName,
          })
        );
    };

    return {
      onEmitUserActionLog,
    };
  }

  createKafkaMessageForUserActionLog(
    userActionId: string,
    stepId: string
  ): UserActionLogKafkaEvent {
    return (
      message: string,
      level: EnumActionLogLevel,
      status: EnumActionStepStatus,
      isStepCompleted: boolean
    ): UserActionLog.KafkaEvent => ({
      key: {
        userActionId,
      },
      value: {
        stepId: stepId,
        message,
        level,
        status,
        isCompleted: isStepCompleted,
      },
    });
  }
  /**
   * Creates a new step for given action with given message and sets its status
   * to running, runs given step function and updates the status of the step
   * with given status and sets it's completion time
   * @param actionId the identifier of the action to add step for
   * @param message the message of the step
   * @param stepFunction the step function to run
   */
  async run<T>(
    actionId: string,
    stepName: string,
    message: string,
    stepFunction: (step: ActionStep) => Promise<T>,
    leaveStepOpenAfterSuccessfulExecution = false
  ): Promise<T> {
    const step = await this.createStep(actionId, stepName, message);
    try {
      const result = await stepFunction(step);
      if (!leaveStepOpenAfterSuccessfulExecution) {
        await this.complete(step, EnumActionStepStatus.Success);
      }
      return result;
    } catch (error) {
      this.logger.error(error.message, error);
      await this.log(step, EnumActionLogLevel.Error, error.message);
      await this.complete(step, EnumActionStepStatus.Failed);
      throw error;
    }
  }

  /**
   * Logs given message with given meta with Info level for given step
   * @param step the step to add log for
   * @param message the log message to add to step
   * @param meta metadata to add for the log
   */
  async logInfo(
    step: ActionStep,
    message: string,
    meta: JsonValue = {}
  ): Promise<void> {
    await this.log(step, EnumActionLogLevel.Info, message, meta);
  }
}
