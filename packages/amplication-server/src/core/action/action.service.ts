import { Injectable } from '@nestjs/common';

import { PrismaService } from 'nestjs-prisma';

import {
  Action,
  ActionStep,
  EnumActionLogLevel,
  FindOneActionArgs
} from './dto/';
import { SortOrder } from '@prisma/client';
import { EnumActionStepStatus } from './dto/EnumActionStepStatus';
import { JsonValue } from 'type-fest';

export const SELECT_ID = { id: true };

@Injectable()
export class ActionService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(args: FindOneActionArgs): Promise<Action | null> {
    return this.prisma.action.findOne(args);
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
        createdAt: SortOrder.asc
      },
      include: {
        logs: {
          orderBy: {
            createdAt: SortOrder.asc
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
  async createStep(actionId: string, message: string): Promise<ActionStep> {
    return this.prisma.actionStep.create({
      data: {
        status: EnumActionStepStatus.Running,
        message,
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
