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

@Injectable()
export class ActionService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(args: FindOneActionArgs): Promise<Action | null> {
    return this.prisma.action.findOne(args);
  }

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
   * Creates a new step for given action with given message and set its status
   * to running
   * @param actionId the identifier of the action to add step for
   * @param message the message of the step
   */
  async run(actionId: string, message: string): Promise<ActionStep> {
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
   * Updates the status of active step of given action with given status
   * @param actionId the identifier of the action to update step for
   * @param status the status to update step with
   */
  async complete(
    actionId: string,
    status: EnumActionStepStatus
  ): Promise<void> {
    await this.prisma.actionStep.updateMany({
      where: {
        actionId,
        completedAt: null
      },
      data: {
        status
      }
    });
  }

  /**
   * Logs given message in active step of given action
   * @param actionId the identifier of the action to add log to active step
   * @param message the log message to add to step
   */
  async log(
    actionId: string,
    level: EnumActionLogLevel,
    message: string,
    meta?: JsonValue
  ): Promise<void> {
    await this.prisma.actionLog.updateMany({
      where: {
        step: {
          actionId,
          completedAt: null
        }
      },
      data: {
        level,
        message,
        meta
      }
    });
  }

  async logInfo(
    actionId: string,
    message: string,
    meta?: JsonValue
  ): Promise<void> {
    await this.log(actionId, EnumActionLogLevel.Info, message, meta);
  }
}
