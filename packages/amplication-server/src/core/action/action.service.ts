import { Injectable } from '@nestjs/common';

import { PrismaService } from 'nestjs-prisma';

import {
  Action,
  ActionStep,
  FindOneActionArgs,
  CreateStepArgs,
  CompleteStepArgs,
  CreateLogArgs
} from './dto/';
import { SortOrder } from '@prisma/client';

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

  async createStep(args: CreateStepArgs): Promise<ActionStep> {
    const { actionId, ...rest } = args;

    const action = await this.prisma.action.update({
      where: { id: actionId },
      data: {
        steps: {
          create: {
            ...rest
          }
        }
      },
      include: {
        steps: {
          orderBy: {
            createdAt: SortOrder.desc
          },
          take: 1
        }
      }
    });
    return action.steps[0];
  }

  async completeStep(args: CompleteStepArgs): Promise<void> {
    this.prisma.actionStep.update({
      where: { id: args.where.id },
      data: {
        completedAt: new Date(),
        status: args.status
      }
    });
  }

  async createLog(args: CreateLogArgs): Promise<void> {
    const { stepId, ...rest } = args;

    await this.prisma.actionStep.update({
      where: { id: stepId },
      data: {
        logs: {
          create: {
            ...rest
          }
        }
      }
    });
  }
}
