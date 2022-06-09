import { Inject, Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { JsonValue } from 'type-fest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Prisma, PrismaService } from '@amplication/prisma-db';
import {
  Action,
  ActionStep,
  EnumActionLogLevel,
  FindOneActionArgs
} from './dto/';
import { StepNameEmptyError } from './errors/StepNameEmptyError';
import { EnumActionStepStatus } from './dto/EnumActionStepStatus';

export const SELECT_ID = { id: true };

@Injectable()
export class ActionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
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
        actionId: actionId
      },
      orderBy: {
        createdAt: Prisma.SortOrder.asc
      },
      include: {
        logs: {
          orderBy: {
            createdAt: Prisma.SortOrder.asc
          }
        }
      }
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
          connect: { id: actionId }
        }
      }
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
        id: step.id
      },
      data: {
        status,
        completedAt: new Date()
      },
      select: SELECT_ID
    });
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
          connect: { id: step.id }
        }
      },
      select: SELECT_ID
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
      this.logger.error(error);
      await this.log(step, EnumActionLogLevel.Error, error);
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
